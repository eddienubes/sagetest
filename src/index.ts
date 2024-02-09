import {
  HttpCallable,
  HttpMethod,
  RequestLineSetter,
  SageServer
} from './types.js';
import { HTTP_METHODS } from './constants.js';
import { Sage } from './Sage.js';
import { createServer, Server } from 'node:http';
import { EventEmitter } from 'node:events';
import { AddressInfo } from 'node:net';

/**
 * Generates Sage Assistant with for a given HTTP server
 * @param sageServer
 */
export const request = (sageServer: SageServer): HttpCallable<Sage> => {
  const factory: Record<string, RequestLineSetter<Sage>> = {};

  const server = createServer(sageServer as Server, (req, res) => {
    // Fastify listens to the request event, otherwise the server hangs
    if (sageServer instanceof EventEmitter) {
      server.emit('request', req, res);
    }
  });

  // Immediately start listening
  const listen = (): Promise<Server> => {
    return new Promise((resolve) => {
      server.listen(0, () => {
        resolve(server);
      });
    });
  };

  const port = (server.address() as AddressInfo).port as number;

  for (const method of HTTP_METHODS) {
    factory[method] = (path: string): Sage =>
      Sage.fromRequestLine(
        listen,
        port,
        method.toUpperCase() as HttpMethod,
        path
      );
  }

  return factory as HttpCallable<Sage>;
};

export * from './SageHttpResponse.js';
export * from './constants.js';
export * from './types.js';
export * from './FormDataOptions.js';
export * from './SageException.js';
export * from './utils.js';
