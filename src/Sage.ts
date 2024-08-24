import { HttpMethod, ThenableReject, ThenableResolve } from './types.js';
import { SageHttpRequest } from './SageHttpRequest.js';
import { Readable } from 'node:stream';
import { Client, FormData } from 'undici';
import { Blob } from 'node:buffer';
import { SageException } from './SageException.js';
import {
  isOkay,
  serializeToString,
  isBinary,
  getFileDescriptorFromReadable,
  statusCodeToMessage,
  parseJsonStr,
  isRedirect,
  isError,
  wrapArray,
  parseSetCookieHeader,
  streamToBuffer,
  wrapInPromise
} from './utils.js';
import { SageHttpResponse, SageResponseHeaders } from './SageHttpResponse.js';
import path from 'node:path';
import { FormDataOptions } from './FormDataOptions.js';
import { createReadStream } from 'node:fs';
import { SageConfig } from './SageConfig.js';
import { SageServer } from './SageServer.js';

/**
 * Greetings, I'm Sage - a chainable HTTP Testing Assistant.
 * Not meant to be used directly.
 */
export class Sage {
  private sageServer: SageServer;
  private config: SageConfig;
  private request: SageHttpRequest = {};
  private client: Client;
  // Promises await of which is deferred until .then() is called
  private deferredPromises: Promise<unknown>[] = [];

  /**
   * Sets the HTTP method and path for the request.
   * Not meant to be called directly.
   * @param sageServer
   * @param method
   * @param path
   * @param config
   */
  constructor(
    sageServer: SageServer,
    method: HttpMethod,
    path: string,
    config: SageConfig
  ) {
    this.sageServer = sageServer;
    this.config = config;
    this.request.method = method;
    this.request.path = path;

    const httpClientOptions: Client.Options = {
      keepAliveTimeout: 1,
      keepAliveMaxTimeout: 1
    };

    this.deferredPromises.push(this.sageServer.waitForListening());

    // If the server is already launched, the port should be available
    if (this.sageServer.launched) {
      const port = sageServer.getPort();

      this.client = new Client(`http://localhost:${port}`, httpClientOptions);
    } else {
      void this.sageServer.listen(0);
      const port = sageServer.getPort();

      this.client = new Client(`http://localhost:${port}`, httpClientOptions);
    }
  }

  /**
   * Sets query parameters for the request.
   * Also, the URI spec is quite vague about query params, and their handling is different from environment to environment.
   * I'd advise encoding complex query params into base64 and passing them as a single string.
   * @param query Supposed to be just a record of strings and numbers.
   * Other values/types will be ignored.
   */
  query(query: object): this {
    this.request.query = query;
    return this;
  }

  /**
   * Sets body payload for the request.
   * If body is an object, it will be stringified to JSON. Content-Type will be set to application/json.
   * If body is a string, it will be used as is. Content-Type will remain plain/text.
   * If body is a Readable stream, it will be used as is.
   * If you need to set a different Content-Type, use the set method.
   * @throws SageException if formData is already set
   * @param body
   */
  send(body?: string | object): this {
    if (this.request.formData) {
      throw new SageException('Cannot set both body and formData');
    }

    if (typeof body === 'object') {
      this.set('Content-Type', 'application/json');
      this.request.body = serializeToString(body);
      return this;
    }

    this.request.body = body;
    return this;
  }

  /**
   * Sets a header for the request.
   * Consider using this at the end of the chain if you want to override any of the defaults.
   * @param key
   * @param value
   */
  set(key: string, value: string | string[]): this {
    if (!this.request.headers) {
      this.request.headers = {};
    }

    value = wrapArray(value);

    // If already an array
    if (Array.isArray(this.request.headers[key])) {
      const existingValue = this.request.headers[key] as string[];
      existingValue.push(...value);
      return this;
    }

    // If an existing value is a string, convert it to an array
    if (typeof this.request.headers[key] === 'string') {
      const existingValue = this.request.headers[key] as string;
      this.request.headers[key] = [existingValue, ...value];
      return this;
    }

    // If a single value is passed, don't wrap it in an array
    if (value.length === 1) {
      this.request.headers[key] = value[0];
      return this;
    }

    this.request.headers[key] = value;
    return this;
  }

  /**
   * If password is provided, Basic Auth header will be added.
   * If password is not provided, Bearer token header will be added.
   * Automatically adds Basic or Bearer prefix to the token.
   * @param usernameOrToken
   * @param password
   */
  auth(usernameOrToken: string, password?: string): this {
    if (password) {
      const credentials = Buffer.from(
        `${usernameOrToken}:${password}`
      ).toString('base64');
      this.set('Authorization', `Basic ${credentials}`);
      return this;
    }

    this.set('Authorization', `Bearer ${usernameOrToken}`);
    return this;
  }

  cookie(key: string, value: string): this {
    this.set('Cookie', `${key}=${value}`);
    return this;
  }

  /**
   * Method is designed to work only with FormData requests.
   * Cannot be combined with .send().
   * If file is a string, it will be treated as a path to a file starting from the working directory (process.cwd()).
   * @throws SageException if body is already set
   * @param field
   * @param file a Blob, Buffer, Readable stream or a file path (staring from the working directory)
   * @param options you can pass either object with type and filename or just a string with filename
   */
  attach(
    field: string,
    file: Blob | Buffer | Readable | string,
    options?: FormDataOptions | string
  ): this {
    if (this.request.body) {
      throw new SageException('Cannot set both body and formData');
    }

    const promise = wrapInPromise(async () => {
      if (!this.request.formData) {
        this.request.formData = new FormData();
      }

      // If a string always treat it as a file path
      if (typeof file === 'string') {
        file = createReadStream(path.join(process.cwd(), file));
      }

      if (typeof options === 'string') {
        options = { filename: options };
      }

      // Buffer streams in memory if a buffer flag is true
      if (options?.buffer && file instanceof Readable) {
        // When converting to buffer, preserve the filename and type
        const descriptor = getFileDescriptorFromReadable(file);
        options = {
          ...options,
          filename: options.filename || descriptor?.filename,
          type: options.type || descriptor?.mimetype
        };
        file = await streamToBuffer(file);
      }

      if (file instanceof Readable) {
        const descriptor = getFileDescriptorFromReadable(file);
        // script.js -> js
        // Hacky way to handle streaming in multipart undici
        // https://github.com/nodejs/undici/issues/2202#issuecomment-1664134203
        // To pass isBlobLike check: https://github.com/nodejs/undici/blob/e48df9620edf1428bd457f481d47fa2c77f75322/lib/fetch/formdata.js#L40
        // Filename is also required due to: https://github.com/nodejs/undici/blob/e48df9620edf1428bd457f481d47fa2c77f75322/lib/fetch/formdata.js#L239
        this.request.formData.append(field, {
          [Symbol.toStringTag]: 'File',
          name: options?.filename || descriptor?.filename,
          type: options?.type || descriptor?.mimetype,
          stream: () => file
        });

        return;
      }

      if (isBinary(file)) {
        // Handle Buffer to blob conversion for now
        const blob = new Blob([file], { type: options?.type });
        this.request.formData.append(field, blob, options?.filename);
        return;
      }

      throw new SageException('Cannot attach a non-binary file');
    });

    this.deferredPromises.push(promise);

    return this;
  }

  field(field: string, value: string | string[]): this {
    if (!this.request.formData) {
      this.request.formData = new FormData();
    }

    if (Array.isArray(value)) {
      for (const val of value) {
        this.request.formData.append(field, val);
      }
      return this;
    }

    this.request.formData.append(field, value);

    return this;
  }

  async then(
    resolve: ThenableResolve<SageHttpResponse>,
    reject: ThenableReject
  ): Promise<void> {
    // Wait for all deferred promises to resolve
    await Promise.all(this.deferredPromises);

    if (this.config.baseUrl) {
      this.request.path = `${this.config.baseUrl}${this.request.path}`;
    }

    try {
      const res = await this.client.request({
        method: this.request.method as HttpMethod,
        path: this.request.path as string,
        headers: this.request.headers,
        // Only one of these is expected to be undefined at this point.
        // If FormData is defined, undici will provide headers with the correct Content-Type
        body: this.request.body || this.request.formData,
        query: this.request.query,
        reset: !this.config.keepAlive
      });

      const buffer = Buffer.from(await res.body.arrayBuffer());
      const text = buffer.toString('utf-8');
      const json = parseJsonStr(text);

      // TODO: add stream for piping files
      resolve({
        statusCode: res.statusCode,
        status: res.statusCode,
        statusText: statusCodeToMessage(res.statusCode),
        headers: res.headers as SageResponseHeaders,
        buffer: buffer,
        body: json || buffer,
        text: text,
        ok: isOkay(res.statusCode),
        redirect: isRedirect(res.statusCode),
        location: res.headers?.['location'] as string,
        error: isError(res.statusCode),
        cookies: parseSetCookieHeader(res.headers['set-cookie'])
      } satisfies SageHttpResponse);
    } catch (e) {
      reject(
        new SageException(
          `Failed to make a request to the underlying server, please take a look at the upstream error for more details: `,
          e
        )
      );
    } finally {
      // If there is a dedicated server, skip its shutdown. User is responsible for it.
      if (!this.config.dedicated) {
        await this.sageServer.close();
      }
    }
  }

  /**
   * Request Line term is taken from HTTP spec.
   * https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html
   * @param sageServer
   * @param method
   * @param path
   * @param config
   */
  static fromRequestLine(
    sageServer: SageServer,
    method: HttpMethod,
    path: string,
    config: SageConfig
  ): Sage {
    return new Sage(sageServer, method, path, config);
  }
}
