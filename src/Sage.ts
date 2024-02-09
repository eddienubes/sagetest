import { Server } from 'node:http';
import { HttpMethod, ServerListenResolver, ThenableResolve } from './types.js';
import { SageHttpRequest } from './SageHttpRequest.js';
import { Readable } from 'node:stream';
import { Client, FormData } from 'undici';
import { Blob } from 'node:buffer';
import { SageException } from './SageException.js';
import {
  isOkay,
  isRedirect,
  serializeToString,
  isBinary,
  getFilenameFromReadable,
  statusCodeToMessage
} from './utils.js';
import { SageHttpResponse } from './SageHttpResponse.js';
import path from 'node:path';
import { FormDataOptions } from './FormDataOptions.js';
import { createReadStream } from 'node:fs';

/**
 * Greetings, I'm Sage - a chainable HTTP Testing Assistant
 */
export class Sage {
  private readonly serverListenResolver: () => Promise<Server>;
  private options: SageHttpRequest = {};
  private client: Client;

  /**
   * Initiates Sage assistant but doesn't spin up the server yet.
   * Sets the HTTP method and path for the request.
   * Not meant to be called directly.
   * @param serverListenResolver
   * @param port
   * @param method
   * @param path
   */
  constructor(
    serverListenResolver: ServerListenResolver,
    port: number,
    method: HttpMethod,
    path: string
  ) {
    this.serverListenResolver = serverListenResolver;

    this.options.method = method;
    this.options.path = path;

    this.client = new Client(`http://localhost:${port}`, {
      keepAliveTimeout: 1,
      keepAliveMaxTimeout: 1
    });
  }

  query(query: Record<string | number, string>): this {
    this.options.query = query;
    return this;
  }

  /**
   * Sets body payload for the request.
   * If body is an object, it will be stringified to JSON. Content-Type will be set to application/json.
   * If body is a string, it will be used as is. Content-Type will be set to application/json.
   * If body is a Readable stream, it will be used as is.
   * If you need to set a different Content-Type, use the set method.
   * @throws SageException if formData is already set
   * @param body
   */
  send(body: string | object): this {
    if (this.options.formData) {
      throw new SageException('Cannot set both body and formData');
    }

    if (typeof body != 'string') {
      this.set('Content-Type', 'application/json');
      this.options.body = serializeToString(body);
      return this;
    }

    this.options.body = body;
    return this;
  }

  /**
   * Sets a header for the request.
   * Consider using this at the end of the chain if you want to override any of the defaults.
   * @param key
   * @param value
   */
  set(key: string, value: string): this {
    this.options.headers = { ...(this.options.headers || {}), [key]: value };
    return this;
  }

  /**
   * Method is designed to work only with FormData requests.
   * Cannot be combined with .send().
   * If file is a string, it will be treated as a path to a file starting from the working directory (process.cwd()).
   * @throws SageException if body is already set
   * @param field
   * @param file
   * @param options you can pass either object with type and filename or just a string with filename
   */
  attach(
    field: string,
    file: Blob | Buffer | Readable | string,
    options?: FormDataOptions | string
  ): this {
    if (this.options.body) {
      throw new SageException('Cannot set both body and formData');
    }

    if (!this.options.formData) {
      this.options.formData = new FormData();
    }

    if (typeof options === 'string') {
      options = { filename: options };
    }

    if (file instanceof Readable) {
      const filename = getFilenameFromReadable(file);
      // Hacky way to handle streaming in multipart undici
      // https://github.com/nodejs/undici/issues/2202#issuecomment-1664134203
      // To pass isBlobLike check: https://github.com/nodejs/undici/blob/e48df9620edf1428bd457f481d47fa2c77f75322/lib/fetch/formdata.js#L40
      // Filename is also required due to: https://github.com/nodejs/undici/blob/e48df9620edf1428bd457f481d47fa2c77f75322/lib/fetch/formdata.js#L239
      this.options.formData.append(field, {
        [Symbol.toStringTag]: 'File',
        name: options?.filename || filename,
        type: options?.type,
        stream: () => file
      });

      return this;
    }

    // Read file as a filename here
    if (typeof file === 'string') {
      const filePath = path.join(process.cwd(), file);
      const fileStream = createReadStream(filePath);

      // Hacky way to handle multipart streaming in undici
      // https://github.com/nodejs/undici/issues/2202#issuecomment-1664134203
      // To pass isBlobLike check: https://github.com/nodejs/undici/blob/e48df9620edf1428bd457f481d47fa2c77f75322/lib/fetch/formdata.js#L40
      // Filename is also required due to: https://github.com/nodejs/undici/blob/e48df9620edf1428bd457f481d47fa2c77f75322/lib/fetch/formdata.js#L239
      this.options.formData.append(field, {
        [Symbol.toStringTag]: 'File',
        name: options?.filename || file,
        type: options?.type,
        stream: () => fileStream
      });
      return this;
    }

    if (isBinary(file)) {
      // Handle Buffer to blob conversion for now
      const blob = new Blob([file], { type: options?.type });
      this.options.formData.append(field, blob, options?.filename);
      return this;
    }

    throw new SageException('Cannot attach a non-binary file');
  }

  field(field: string, value: string | string[]): this {
    if (!this.options.formData) {
      this.options.formData = new FormData();
    }

    if (Array.isArray(value)) {
      for (const val of value) {
        this.options.formData.append(field, val);
      }
      return this;
    }

    this.options.formData.append(field, value);

    return this;
  }

  async then(resolve: ThenableResolve<SageHttpResponse>): Promise<void> {
    // Make sure the server is listening before making a request
    await this.serverListenResolver();

    try {
      const data: Uint8Array[] = [];
      let responseHeaders: any;
      let responseStatusCode: any;

      await new Promise((resolve, reject) => {
        this.client.dispatch(
          {
            method: this.options.method as HttpMethod,
            path: this.options.path as string,
            headers: this.options.headers,
            // Only one of these is expected to be undefined at this point.
            // If FormData is defined, undici will provide headers with the correct Content-Type
            body: this.options.body || this.options.formData,
            query: this.options.query,
            reset: true
          },
          {
            onConnect: () => {
              // console.log('Connected!');
            },
            onError: (error) => {
              // console.error(error);
            },
            onData(chunk: Buffer): boolean {
              return true;
            },
            onHeaders: (statusCode, headers) => {
              responseHeaders = headers;
              responseStatusCode = statusCode;
              return true;
            },
            onComplete: (trailers) => {
              resolve(null);
            }
          }
        );
      });

      // const data = response.opaque as Opaque;
      const text = Buffer.concat(data).toString('utf-8');
      // const json = parseJsonStr(text);

      // const buffer = Buffer.concat(buffers);
      // const text = await res.body.text();

      // await res.body.dump();

      resolve({
        statusCode: responseStatusCode,
        status: responseStatusCode,
        statusText: statusCodeToMessage(responseStatusCode),
        headers: responseHeaders,
        body: {},
        text: text,
        ok: isOkay(responseStatusCode),
        redirect: isRedirect(responseStatusCode),
        location: responseHeaders?.['location'] as string
      } as SageHttpResponse);
    } catch (e) {
      throw new SageException(
        `Failed to make a request to the underlying server, please take a look at the upstream error for more details: `,
        e
      );
    }
  }

  /**
   * Request Line term is taken from HTTP spec.
   * https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html
   * @param serverListenResolver
   * @param port
   * @param method
   * @param path
   */
  static fromRequestLine(
    serverListenResolver: ServerListenResolver,
    port: number,
    method: HttpMethod,
    path: string
  ): Sage {
    return new Sage(serverListenResolver, port, method, path);
  }
}
