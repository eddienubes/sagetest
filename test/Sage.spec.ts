import { createServer } from 'node:http';
import { Sage } from '../src/Sage.js';
import { getExpressApp, getFastifyApp } from './utils.js';
import { ConfigStore } from '../src/ConfigStore.js';
import { SAGE_DEFAULT_CONFIG } from '../src/index.js';

describe('Sage', () => {
  it('should initialize sage assistant', async () => {
    const expressServer = createServer(getExpressApp());
    const fastifyServer = getFastifyApp();
    const server = createServer();
    const store = new ConfigStore(SAGE_DEFAULT_CONFIG);
    const config = store.getConfig();

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
      '/test',
      config
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
      '/test',
      config
    );
    const sage3 = new Sage(
      {
        server,
        listenResolver: (): Promise<void> =>
          new Promise((resolve) => server.on('listening', () => resolve())),
        launched: false
      },
      'GET',
      '/test',
      config
    );
    expect(sage1).toBeTruthy();
    expect(sage2).toBeTruthy();
    expect(sage3).toBeTruthy();
  });
});
