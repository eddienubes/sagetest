import { createServer, RequestListener, Server } from 'node:http';
import { HttpMethod, SageServer } from './types.js';
import { SageHttpOptions } from './SageHttpOptions.js';

/**
 * Greetings, I'm Sage - a chainable HTTP Testing Assistant
 */
export class Sage {
  private server: Server;
  private options: SageHttpOptions = {};

  /**
   * Initiates Sage assistant but doesn't spin up the server yet.
   * Sets the HTTP method and path for the request.
   * Not meant to be called directly.
   * @param server
   * @param method
   * @param path
   */
  constructor(server: SageServer, method?: HttpMethod, path?: string) {
    this.server = createServer(server as RequestListener);

    this.options.method = method;
    this.options.path = path;
  }

  /**
   * Spins up the underlying server
   */
  async listen(): Promise<Sage> {
    await new Promise((resolve) => {
      this.server.listen(0, () => {
        resolve(this);
      });
    });
    return this;
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

  [key: string | symbol]: unknown;
}
