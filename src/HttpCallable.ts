import { HTTP_METHODS } from './constants.js';

export type HttpCallable = {
  [K in (typeof HTTP_METHODS)[number]]: (path: string) => HttpCallable;
};
