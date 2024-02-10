import { RequestListener, Server as HttpServer } from 'node:http';
import { HTTP_METHODS } from './constants.js';
import { Dispatcher } from 'undici';

export type ServerSource = HttpServer | RequestListener;
/**
 * RequestListener and Server are both acceptable because Server implements ServerOptions interface
 */
export type SageServer = {
  server: HttpServer;
  /**
   * Returns a promise that resolves when server is ready to accept connections
   */
  listenResolver: ServerListenResolver;
  launched: boolean;
};
export type ServerListenResolver = () => Promise<void>;
export type RequestLineSetter<T> = (path: string) => T;
export type HttpCallable<T> = {
  [K in (typeof HTTP_METHODS)[number]]: RequestLineSetter<T>;
} & ServerShutdownCapable;
export type HttpMethod = Dispatcher.HttpMethod;
export type ServerShutdownCapable = {
  /**
   * Shutdowns
   */
  shutdown: () => Promise<void>;
};

export type ThenableResolve<T> = (value: T | PromiseLike<T>) => void;
export type ThenableReject = (reason?: unknown) => void;
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
