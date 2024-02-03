import { Server } from 'node:http';
import { Sage } from './Sage.js';

export const request = (server: Server): Sage => {
  return new Sage(server);
};
