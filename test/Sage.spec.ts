import { createServer } from 'node:http';
import { Sage } from '../src/Sage.js';

describe('Sage', () => {
  it('should initialize sage assistant', async () => {
    const server = createServer();
    const sage = new Sage(server);
    expect(sage).toBeTruthy();
  });
});
