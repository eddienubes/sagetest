import { ServerSource } from './types.js';
import { createServer, Server } from 'node:http';
import { EventEmitter } from 'node:events';
import { AddressInfo } from 'node:net';
import { SageException } from './SageException.js';
import { Client } from 'undici';

export class SageServer {
  public launched = false;
  public listening = false;

  private server: Server;
  private listeningPromise: Promise<void> | null = null;
  // One HTTP client per server, so connections are pooled and reused across requests
  private client: Client | null = null;

  constructor(source: ServerSource) {
    this.server = createServer(source as Server, (req, res) => {
      // Fastify listens to the request event, otherwise the server hangs
      if (source instanceof EventEmitter) {
        source.emit('request', req, res);
      }
    });
  }

  async waitForListening(): Promise<void> {
    if (this.listening || !this.launched || !this.listeningPromise) {
      return;
    }

    return await this.listeningPromise;
  }

  async listen(port: number): Promise<void> {
    if (this.launched) {
      return;
    }

    this.launched = true;

    this.listeningPromise = new Promise((resolve) => {
      this.server.listen(port, () => {
        this.listening = true;
        resolve();
      });
    });

    return await this.listeningPromise;
  }

  async close(): Promise<void> {
    const client = this.client;
    this.client = null;
    await client?.close();

    return new Promise((resolve) => {
      this.server.close(() => {
        this.listening = false;
        this.launched = false;
        resolve();
      });
    });
  }

  getClient(): Client {
    if (!this.client) {
      this.client = new Client(`http://localhost:${this.getPort()}`);
    }

    return this.client;
  }

  getPort(): number {
    const address = this.server.address() as AddressInfo | null;

    if (!address?.port) {
      throw new SageException(
        'Server has not been launched yet, cannot retrieve port. Please report this error if encountered'
      );
    }

    return address.port;
  }
}
