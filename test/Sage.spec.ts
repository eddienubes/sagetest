import { createServer } from 'node:http';
import { Sage } from '../src/Sage.js';
import { getExpressApp, getFastifyApp } from './utils.js';

describe('Sage', () => {
  it('should initialize sage assistant', async () => {
    const expressApp = getExpressApp();
    const fastifyApp = getFastifyApp();
    const server = createServer();

    const sage1 = new Sage(expressApp);
    const sage2 = new Sage(fastifyApp);
    const sage3 = new Sage(server);

    await sage1.listen();
    await sage2.listen();
    await sage3.listen();

    expect(sage1).toBeTruthy();
    expect(sage2).toBeTruthy();
    expect(sage3).toBeTruthy();
  });
});
