import { createServer, RequestListener, Server } from 'node:http';
import {
  HttpMethod,
  SageServer,
  ThenableReject,
  ThenableResolve
} from './types.js';
import { SageHttpRequestOptions } from './SageHttpRequestOptions.js';
import { WebSocket } from 'vite';
import AddressInfo = WebSocket.AddressInfo;
import { Readable } from 'node:stream';
import { request } from 'undici';
import { SageException } from './SageException.js';

/**
 * Greetings, I'm Sage - a chainable HTTP Testing Assistant
 */
export class Sage {
  private server: Server;
  private options: SageHttpRequestOptions = {};

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

  send(body: string | object): this {
    if (this.options.formData) {
      throw new SageException('Cannot set both body and formData');
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
    }

    this.options.formData.append(field, file);

    return this;
  }

  async then(
    resolve: ThenableResolve<any>,
    reject: ThenableReject
  ): Promise<void> {
    const { port } = await this.listen();

    const res = await request(`http://localhost:${port}${this.options.path}`, {
      method: this.options.method,
      headers: this.options.headers,
      body: this.options.body
    });

    resolve('Success!');
  }

  /**
   * Spins up the underlying server
   */
  private async listen(): Promise<AddressInfo> {
    return await new Promise((resolve) => {
      // Listen on the ephemeral port
      this.server.listen(0, () => {
        const addressInfo = this.server.address() as AddressInfo;
        resolve(addressInfo);
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
