import { createServer } from 'node:http';
import { Sage } from '../src/Sage.js';
import { getExpressApp, getFastifyApp } from './utils.js';

describe('Sage', () => {
  it('should initialize sage assistant', async () => {
    const expressServer = createServer(getExpressApp());
    const fastifyServer = getFastifyApp();
    const server = createServer();

    const sage1 = new Sage(
      {
        server: expressServer,
        listenResolver: (): Promise<void> =>
          new Promise((resolve) =>
            expressServer.on('listening', () => resolve())
          ),
        launched: false
      },
      'GET',
      '/test'
    );
    const sage2 = new Sage(
      {
        server: fastifyServer.server,
        listenResolver: (): Promise<void> =>
          new Promise((resolve) =>
            fastifyServer.server.on('listening', () => resolve())
          ),
        launched: false
      },
      'GET',
      '/test'
    );
    const sage3 = new Sage(
      {
        server,
        listenResolver: (): Promise<void> =>
          new Promise((resolve) => server.on('listening', () => resolve())),
        launched: false
      },
      'GET',
      '/test'
    );

    expect(sage1).toBeTruthy();
    expect(sage2).toBeTruthy();
    expect(sage3).toBeTruthy();
  });
});
