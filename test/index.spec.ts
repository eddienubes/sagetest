import { getExpressApp } from './utils.js';
import { request } from '../src/index.js';

const app = getExpressApp();

describe('index', () => {
  describe('request', () => {
    it('should create new Sage instance and wrap it up with a Proxy', async () => {
      const res = await request(app).post('/api').query({
        whatever: 'value'
      });

      expect(res).toEqual('Success!');
    });
  });
});
