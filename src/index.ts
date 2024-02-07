import {
  HttpCallable,
  HttpMethod,
  RequestLineSetter,
  SageServer
} from './types.js';
import { HTTP_METHODS } from './constants.js';
import { Sage } from './Sage.js';

export const request = (server: SageServer): HttpCallable<Sage> => {
  const factory: Record<string, RequestLineSetter<Sage>> = {};

  for (const method of HTTP_METHODS) {
    factory[method] = (path: string): Sage =>
      Sage.fromRequestLine(server, method.toUpperCase() as HttpMethod, path);
  }

  return factory as HttpCallable<Sage>;
};
