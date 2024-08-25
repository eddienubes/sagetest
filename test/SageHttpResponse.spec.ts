import { SageHttpResponse } from '../src/index.js';

describe(SageHttpResponse.name, () => {
  describe('get', () => {
    it('should returns headers joined by comma', async () => {
      const response = new SageHttpResponse({
        headers: {
          'some-header': ['i', 'love', 'my mom!']
        }
      } as any);

      const result = response.get('some-header');

      expect(result).toEqual('i, love, my mom!');
    });

    it('should ignore casing', async () => {
      const response = new SageHttpResponse({
        headers: {
          'some-header': ['i', 'love', 'my mom!']
        }
      } as any);

      const result = response.get('Some-Header');

      expect(result).toEqual('i, love, my mom!');
    });

    it('should return null if header is not set', async () => {
      const response = new SageHttpResponse({
        headers: {
          'some-header': ['i', 'love', 'my mom!']
        }
      } as any);

      const result = response.get('Some-Other-Header');

      expect(result).toEqual(null);
    });

    it('should return simple header value', async () => {
      const response = new SageHttpResponse({
        headers: {
          'content-type': 'application/json'
        }
      } as any);

      const result = response.get('Content-Type');

      expect(result).toEqual('application/json');
    });
  });
});
