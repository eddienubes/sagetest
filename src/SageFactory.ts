import { Sage } from './Sage.js';
import { HTTP_METHODS } from './constants.js';

export type SageFactory = {
  /**
   * Creates a Sage instance for the given path and HTTP method.
   */
  [K in (typeof HTTP_METHODS)[number]]: <T = any>(path: string) => Sage<T>;
} & {
  /**
   * Shuts down the server. Only works in dedicated mode.
   */
  close: () => Promise<void>;
};
