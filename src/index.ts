import { Sage } from './Sage.js';
import { HttpCallableSage, HttpMethod, SageServer } from './types.js';
import { HTTP_METHODS } from './constants.js';

export const request = (server: SageServer): HttpCallableSage => {
  let sage = new Sage(server);
  sage = new Proxy<Sage>(sage, {
    get(target, propertyName): any {
      if (propertyName in HTTP_METHODS) {
        return (path: string) =>
          Sage.fromRequestLine(server, propertyName as HttpMethod, path);
      }
      return target[propertyName];
    }
  });

  return sage as HttpCallableSage;
};
