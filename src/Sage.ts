import { createServer, RequestListener, Server } from 'node:http';
import { AddressInfo } from 'node:net';
import {
  HttpMethod,
  SageServer,
  ThenableReject,
  ThenableResolve
} from './types.js';
import { SageHttpRequest } from './SageHttpRequest.js';
import { Readable } from 'node:stream';
import { request } from 'undici';
import { SageException } from './SageException.js';
import {
  isOkay,
  isRedirect,
  serializeToString,
  statusCodeToMessage
} from './utils.js';
import { SageHttpResponse } from './SageHttpResponse.js';

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
   * If body is an object, it will be stringified to JSON.
   * If body is a string, it will be used as is.
   * Also, it will set the Content-Type header to application/json by default.
   * If you need to set a different Content-Type, use the set method.
   * @throws SageException if formData is already set
   * @param body
   */
  send(body: string | object): this {
    if (this.options.formData) {
      throw new SageException('Cannot set both body and formData');
    }

    if (typeof body != 'string') {
      this.options.headers = {
        ...(this.options.headers || {}),
        'Content-Type': 'application/json'
      };
      this.options.body = serializeToString(body);
      return this;
    }

    this.options.body = body;
    return this;
  }

  set(key: string, value: string): this {
    this.options.headers = { ...(this.options.headers || {}), [key]: value };
    return this;
  }

  attach(field: string, file: Blob | Buffer | Readable | string): this {
    if (this.options.body) {
      throw new SageException('Cannot set both body and formData');
    }

    if (!this.options.formData) {
      this.options.formData = new FormData();
    }

    this.options.formData;

    if (typeof file === 'string') {
      // TODO: Read from file system
      throw new Error('Not implemented');
    }

    this.options.formData.append(field, file);

    return this;
  }

  async then(
    resolve: ThenableResolve<SageHttpResponse>,
    reject: ThenableReject
  ): Promise<void> {
    const port = await this.listen();

    try {
      const res = await request(
        `http://localhost:${port}${this.options.path}`,
        {
          method: this.options.method,
          headers: this.options.headers,
          body: this.options.body
        }
      );
      const text = await res.body.text();
      const json = JSON.parse(text);

      resolve({
        statusCode: res.statusCode,
        status: res.statusCode,
        statusText: statusCodeToMessage(res.statusCode),
        headers: res.headers,
        body: json,
        text: text,
        ok: isOkay(res.statusCode),
        redirect: isRedirect(res.statusCode)
      } satisfies SageHttpResponse);
    } catch (e) {
      throw e;
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
        resolve(3000);
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
