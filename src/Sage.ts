import { createServer, RequestListener, Server } from 'node:http';
import { AddressInfo } from 'node:net';
import { HttpMethod, SageServer, ThenableResolve } from './types.js';
import { SageHttpRequest } from './SageHttpRequest.js';
import { Readable } from 'node:stream';
import { request, FormData } from 'undici';
import { Blob } from 'node:buffer';
import { SageException } from './SageException.js';
import {
  isOkay,
  isRedirect,
  serializeToString,
  statusCodeToMessage,
  parseJsonStr,
  isBinary
} from './utils.js';
import { SageHttpResponse } from './SageHttpResponse.js';
import * as path from 'path';
import * as fs from 'fs';
import { FormDataOptions } from './FormDataOptions.js';

/**
 * Greetings, I'm Sage - a chainable HTTP Testing Assistant
 */
export class Sage {
  private server: Server;
  private options: SageHttpRequest = {};

  /**
   * Initiates Sage assistant but doesn't spin up the server yet.
   * Sets the HTTP method and path for the request.
   * Not meant to be called directly.
   * @param server
   * @param method
   * @param path
   */
  constructor(server: SageServer, method: HttpMethod, path: string) {
    this.server = createServer(server as RequestListener);

    this.options.method = method;
    this.options.path = path;
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
   *
   * @throws SageException if body is already set
   * @param field
   * @param file
   * @param options
   */
  attach(
    field: string,
    file: Blob | Buffer | string,
    options?: FormDataOptions
  ): this {
    if (this.options.body) {
      throw new SageException('Cannot set both body and formData');
    }

    if (!this.options.formData) {
      this.options.formData = new FormData();
    }

    if (typeof file === 'string') {
      const filePath = path.join(process.cwd(), file);
      const fileStream = fs.createReadStream(filePath);

      this.options.formData.append(field, fileStream);
      return this;
    }

    if (isBinary(file)) {
      // Just handle Buffer to blob conversion for now
      const blob = new Blob([file], { type: options?.type });
      this.options.formData.append(field, blob, options?.filename);
      return this;
    }

    throw new SageException('Cannot attach a non-binary file');
  }

  field(field: string, value: string): this {
    if (!this.options.formData) {
      this.options.formData = new FormData();
    }

    this.options.formData.append(field, value);

    return this;
  }

  async then(resolve: ThenableResolve<SageHttpResponse>): Promise<void> {
    const port = await this.listen();

    try {
      const res = await request(
        `http://localhost:${port}${this.options.path}`,
        {
          method: this.options.method,
          headers: this.options.headers,
          // Only one of these is expected to be undefined at this point.
          // If FormData is defined, undici will provide headers with the correct Content-Type
          body: this.options.body || this.options.formData,
          query: this.options.query
        }
      );
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
        location: res.headers['location'] as string
      } satisfies SageHttpResponse);
    } catch (e) {
      throw new SageException(
        `Failed to make a request to the underlying server, please take a look at the upstream error for more details`,
        e
      );
    }
  }

  /**
   * Spins up the underlying server
   */
  private async listen(): Promise<number> {
    return await new Promise((resolve) => {
      // Listen on the ephemeral port
      this.server.listen(0, () => {
        const addressInfo = this.server.address() as AddressInfo;
        resolve(addressInfo.port);
      });
    });
  }

  /**
   * Request Line term is taken from HTTP spec.
   * https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html
   * @param server
   * @param method
   * @param path
   */
  static fromRequestLine(
    server: SageServer,
    method: HttpMethod,
    path: string
  ): Sage {
    return new Sage(server, method, path);
  }
}
