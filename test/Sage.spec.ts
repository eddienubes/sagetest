import { createServer } from 'node:http';
import { Sage } from '../src/Sage.js';
import { getExpressApp, getFastifyApp } from './utils.js';

describe('Sage', () => {
  it('should initialize sage assistant', async () => {
    const expressApp = getExpressApp();
    const fastifyApp = getFastifyApp();
    const server = createServer();

    const sage1 = new Sage(expressApp, 'GET', '/test');
    const sage2 = new Sage(fastifyApp.server, 'GET', '/test');
    const sage3 = new Sage(server, 'GET', '/test');

    expect(sage1).toBeTruthy();
    expect(sage2).toBeTruthy();
    expect(sage3).toBeTruthy();
  });
});
