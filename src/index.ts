import {
  DeepPartial,
  HttpCallable,
  HttpMethod,
  RequestLineSetter,
  ServerSource
} from './types.js';
import { HTTP_METHODS, SAGE_DEFAULT_CONFIG } from './constants.js';
import { Sage } from './Sage.js';
import { createServer, Server } from 'node:http';
import { EventEmitter } from 'node:events';
import { AddressInfo } from 'node:net';
import { SageConfig } from './SageConfig.js';
import { ConfigStore } from './ConfigStore.js';

/**
 * Generates Sage Assistant with for a given HTTP server
 * @param serverSource
 * @param overrides
 */
export const request = (
  serverSource: ServerSource,
  overrides?: DeepPartial<SageConfig>
): HttpCallable<Sage> => {
  const configStore = new ConfigStore<SageConfig>(
    SAGE_DEFAULT_CONFIG,
    overrides
  );
  const config = configStore.getConfig();

  const server = createServer(serverSource as Server, (req, res) => {
    // Fastify listens to the request event, otherwise the server hangs
    if (serverSource instanceof EventEmitter) {
      server.emit('request', req, res);
    }
  });

  const listenResolver = new Promise<void>((resolve) => {
    server.on('listening', () => {
      resolve();
    });
  });

  if (!config.dedicated) {
    // Listen to an ephemeral port
    server.listen(0);
  }

  const factory: Record<string, RequestLineSetter<Sage>> = {};
  for (const method of HTTP_METHODS) {
    factory[method] = (path: string): Sage =>
      Sage.fromRequestLine(
        {
          server,
          listenResolver,
          launched: true
        },
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
