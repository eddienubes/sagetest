import { getExpressApp } from './utils.js';
import { dedicated } from '../src/index.js';

const app = getExpressApp();

describe('Generic Cases Related to Dedicated Mode', () => {
  describe('baseUrl', () => {
    it('should append baseUrl to the beginning of the path request', async () => {
      // literally calls the endpoint /redirect
      const request = dedicated(app, {
        baseUrl: '/redirect'
      });

      const res = await request.get('/');

      expect(res.statusCode).toBe(301);
      expect(res.redirect).toBe(true);
    });
  });
});
