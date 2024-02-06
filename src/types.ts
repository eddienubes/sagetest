import { RequestListener, Server as HttpServer } from 'node:http';
import { HTTP_METHODS } from './constants.js';
import { Sage } from './Sage.js';
import { Dispatcher } from 'undici';

/**
 * RequestListener and Server are both acceptable because Server implements ServerOptions interface
 */
export type SageServer = HttpServer | RequestListener;
export type RequestLineSetter<T> = (path: string) => T;
export type HttpCallable<T> = {
  [K in (typeof HTTP_METHODS)[number]]: RequestLineSetter<T>;
};
export type HttpCallableSage = HttpCallable<Sage> & Sage;
export type HttpMethod = Dispatcher.HttpMethod;
