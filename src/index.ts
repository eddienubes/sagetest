import {
  DeepPartial,
  HttpCallable,
  HttpMethod,
  ServerSource
} from './types.js';
import { HTTP_METHODS, SAGE_DEFAULT_CONFIG } from './constants.js';
import { Sage } from './Sage.js';
import { createServer, Server } from 'node:http';
import { EventEmitter } from 'node:events';
import { SageConfig } from './SageConfig.js';
import { ConfigStore } from './ConfigStore.js';
import { SageException } from './SageException.js';

/**
 * Generates Sage Assistant for a given HTTP server
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
      serverSource.emit('request', req, res);
    }
  });
  const listenPromise = new Promise<void>((resolve) => {
    server.on('listening', () => {
      resolve();
    });
  });

  if (config.dedicated) {
    // Listen to an ephemeral port
    server.listen(config.port);
  }

  const factory = {
    shutdown: () => {
      if (!config.dedicated) {
        throw new SageException(
          'Cannot shutdown a non-dedicated server. One-time servers are automatically closed after the request is finished. Use this method only for dedicated servers.'
        );
      }
      return new Promise((resolve) => {
        server.close(() => {
          resolve();
        });
      });
    }
  } as HttpCallable<Sage>;

  // Fills up the factory with HTTP methods.
  for (const method of HTTP_METHODS) {
    factory[method] = (path: string): Sage =>
      Sage.fromRequestLine(
        {
          server,
          listenResolver: () => listenPromise,
          launched: config.dedicated
        },
        method.toUpperCase() as HttpMethod,
        path,
        config
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
