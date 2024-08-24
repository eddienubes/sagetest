import { SageServer } from '../src/SageServer.js';
import { getExpressApp } from './utils.js';

describe(SageServer.name, () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  describe('listen', () => {
    it('should not launch the server if it is already launched', async () => {
      const express = getExpressApp();

      const server = new SageServer(express);
      server.launched = true;

      await server.listen(3000);

      expect(server.listening).toBe(false);
    });

    it('should launch the server if it has bot been launched', async () => {
      const express = getExpressApp();

      const server = new SageServer(express);
      await server.listen(3000);

      expect(server.launched).toBe(true);
      expect(server.listening).toBe(true);

      await server.close();

      expect(server.launched).toBe(false);
      expect(server.listening).toBe(false);
    });
  });
});
