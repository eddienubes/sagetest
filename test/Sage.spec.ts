import { createServer } from 'node:http';
import { Sage } from '../src/Sage.js';
import { getExpressApp, getFastifyApp } from './utils.js';
import { ConfigStore } from '../src/ConfigStore.js';
import { SAGE_DEFAULT_CONFIG } from '../src/index.js';
import { SageServer } from '../src/SageServer.js';

describe('Sage', () => {
  it('should initialize sage assistant', async () => {
    const expressServer = createServer(getExpressApp());
    const fastifyServer = getFastifyApp();
    const server = createServer();
    const store = new ConfigStore(SAGE_DEFAULT_CONFIG);
    const config = store.getConfig();

    const expressSageServer = new SageServer(expressServer);
    const fastifySageServer = new SageServer(fastifyServer.server);
    const httpSageServer = new SageServer(server);

    const sage1 = new Sage(expressSageServer, 'GET', '/test', config);
    const sage2 = new Sage(fastifySageServer, 'GET', '/test', config);
    const sage3 = new Sage(httpSageServer, 'GET', '/test', config);
    expect(sage1).toBeTruthy();
    expect(sage2).toBeTruthy();
    expect(sage3).toBeTruthy();
  });
});
