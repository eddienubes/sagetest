import { Server } from 'node:http';
import { HttpMethod, SageServer, ThenableResolve } from './types.js';
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
  statusCodeToMessage,
  parseJsonStr
} from './utils.js';
import { SageHttpResponse } from './SageHttpResponse.js';
import path from 'node:path';
import { FormDataOptions } from './FormDataOptions.js';
import { createReadStream } from 'node:fs';
import { AddressInfo } from 'node:net';
import { SageConfig } from './SageConfig.js';

/**
 * Greetings, I'm Sage - a chainable HTTP Testing Assistant
 */
export class Sage {
  private sageServer: SageServer;
  private config: SageConfig;
  private request: SageHttpRequest = {};
  private client: Client;

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

    // If the server is already launched, the port should be available
    if (this.sageServer.launched) {
      const port = this.getServerPort(this.sageServer.server);

      this.client = new Client(`http://localhost:${port}`, httpClientOptions);
      return;
    }

    this.sageServer.server.listen(0);
    const port = this.getServerPort(this.sageServer.server);

    this.client = new Client(`http://localhost:${port}`, httpClientOptions);
  }

  query(query: Record<string | number, string>): this {
    this.request.query = query;
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
    if (this.request.formData) {
      throw new SageException('Cannot set both body and formData');
    }

    if (typeof body != 'string') {
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
  set(key: string, value: string): this {
    this.request.headers = { ...(this.request.headers || {}), [key]: value };
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
    if (this.request.body) {
      throw new SageException('Cannot set both body and formData');
    }

    if (!this.request.formData) {
      this.request.formData = new FormData();
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
      this.request.formData.append(field, {
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
      this.request.formData.append(field, {
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
      this.request.formData.append(field, blob, options?.filename);
      return this;
    }

    throw new SageException('Cannot attach a non-binary file');
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

  async then(resolve: ThenableResolve<SageHttpResponse>): Promise<void> {
    // Make sure the server is listening before making a request
    await this.sageServer.listenResolver();

    try {
      const res = await this.client.request({
        method: this.request.method as HttpMethod,
        path: this.request.path as string,
        headers: this.request.headers,
        // Only one of these is expected to be undefined at this point.
        // If FormData is defined, undici will provide headers with the correct Content-Type
        body: this.request.body || this.request.formData,
        query: this.request.query,
        reset: true
      });

      const text = await res.body.text();
      const json = parseJsonStr(text);

      resolve({
        statusCode: res.statusCode,
        status: res.statusCode,
        statusText: statusCodeToMessage(res.statusCode),
        headers: res.headers,
        body: json,
        text: text,
        ok: isOkay(res.statusCode),
        redirect: isRedirect(res.statusCode),
        location: res.headers?.['location'] as string
      } as SageHttpResponse);
    } catch (e) {
      throw new SageException(
        `Failed to make a request to the underlying server, please take a look at the upstream error for more details: `,
        e
      );
    } finally {
      // If there is a dedicated server, skip its shutdown
      if (!this.config.dedicated) {
        this.sageServer.server.close();
      }
    }
  }

  private getServerPort(server: Server): number {
    const address = server.address() as AddressInfo | null;

    if (!address?.port) {
      throw new SageException(
        'Server is not listening, please report this error if encountered'
      );
    }

    return address.port;
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
