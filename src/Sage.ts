import { createServer, RequestListener, Server } from 'node:http';
import { Dispatcher, request } from 'undici';
import HttpMethod = Dispatcher.HttpMethod;
import { SageServer } from './types.js';

/**
 * Greetings, I'm Sage - a chainable HTTP Testing Assistant
 */
export class Sage {
  private server: Server;

  /**
   * Initializes Sage assistant but doesn't spin up the server yet.
   * @param server
   */
  constructor(server: SageServer) {
    this.server = createServer(server as RequestListener);
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

  async request(method: HttpMethod, path: string): Promise<any> {
    return await request(path, {
      method
    });
  }
}
