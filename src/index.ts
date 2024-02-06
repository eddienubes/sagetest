import { Sage } from './Sage.js';
import { HttpCallable } from './HttpCallable.js';
import { SageServer } from './types.js';

export const request = (server: SageServer): HttpCallable & Sage => {
  const sage = new Sage(server);

  const proxy = new Proxy(sage, {
    get(...args: []): any {
      console.log(args);
    }
  });

  return proxy as HttpCallable & Sage;
};
