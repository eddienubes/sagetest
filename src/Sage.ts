import { createServer, Server, ServerOptions } from 'node:http';
import { Dispatcher, request } from 'undici';
import HttpMethod = Dispatcher.HttpMethod;

/**
 * Welcome, I'm Sage - chainable HTTP Testing Assistant
 */
export class Sage {
  private server: Server;

  /**
   * Initializes Sage assistant but doesn't spin up the server yet.
   * @param server
   */
  constructor(server: ServerOptions) {
    this.server = createServer(server);
  }

  /**
   * Spins up the underlying server
   */
  async listen(): Promise<Sage> {

    await this.server.listen(0)
  }

  async request(method: HttpMethod, path: string): Promise<any> {
    return await request(path, {
      method
    });
  }

  static async fromServer(server: ServerOptions): Promise<Sage> {
    const sage = new Sage(server);
    await sage.listen();
    return sage;
  }
}
