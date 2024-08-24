import './polyfill.js';
import { DeepPartial, HttpMethod, ServerSource } from './types.js';
import { HTTP_METHODS, SAGE_DEFAULT_CONFIG } from './constants.js';
import { Sage } from './Sage.js';
import { SageConfig } from './SageConfig.js';
import { ConfigStore } from './ConfigStore.js';
import { SageException } from './SageException.js';
import { SageFactory } from './SageFactory.js';
import { SageServer } from './SageServer.js';

/**
 * Generates Sage Assistant for a given HTTP server
 * @param serverSource
 * @param overrides
 */
export const request = (
  serverSource: ServerSource,
  overrides?: DeepPartial<SageConfig>
): SageFactory => {
  const configStore = new ConfigStore<SageConfig>(
    SAGE_DEFAULT_CONFIG,
    overrides
  );
  const config = configStore.getConfig();

  const server = new SageServer(serverSource);

  if (config.dedicated) {
    // Listen to an ephemeral port
    void server.listen(config.port);
  }

  const factory = {
    close: async () => {
      if (!config.dedicated) {
        throw new SageException(
          'Cannot shutdown a non-dedicated server. One-time servers are automatically closed after the request is finished. Use this method only for dedicated servers.'
        );
      }

      await server.close();
    }
  } as SageFactory;

  // Fills up the factory with HTTP methods.
  for (const method of HTTP_METHODS) {
    factory[method] = <T>(path: string): Sage<T> =>
      Sage.fromRequestLine<T>(
        server,
        method.toUpperCase() as HttpMethod,
        path,
        config
      );
  }

  return factory;
};

/**
 * Generates Sage Assistant for a given HTTP server.
 * Just an alias for request() with dedicated: true
 * @param serverSource
 * @param config
 */
export const dedicated = (
  serverSource: ServerSource,
  config?: Omit<DeepPartial<SageConfig>, 'dedicated'>
): SageFactory => {
  return request(serverSource, {
    ...config,
    dedicated: true
  });
};

export * from './SageHttpResponse.js';
export * from './constants.js';
export * from './types.js';
export * from './FormDataOptions.js';
export * from './SageException.js';
export * from './utils.js';
export * from './Sage.js';
export * from './SageConfig.js';
