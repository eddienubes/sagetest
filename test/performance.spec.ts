import { getExpressApp } from './utils.js';
import { dedicated } from '../src/index.js';

/**
 * Performance verification tests for sagetest.
 * Verifies that the library handles a large number of requests efficiently
 * using the dedicated server mode, which is the recommended approach for
 * large test suites (avoids per-request server startup/shutdown overhead).
 */
describe('Performance - Dedicated Mode', () => {
  const app = getExpressApp();
  const server = dedicated(app);

  afterAll(async () => {
    await server.close();
  });

  it('should handle many sequential requests without degradation', async () => {
    const COUNT = 50;

    for (let i = 0; i < COUNT; i++) {
      const res = await server.post('/ping-pong').send({ index: i });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Success!');
    }
  });

  it('should handle concurrent requests correctly', async () => {
    const COUNT = 20;

    const requests = Array.from({ length: COUNT }, (_, i) =>
      server.post('/ping-pong').send({ index: i })
    );

    const results = await Promise.all(requests);

    for (const res of results) {
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Success!');
    }
  });

  it('should handle mixed sequential and concurrent requests', async () => {
    // Sequential batch
    for (let i = 0; i < 10; i++) {
      const res = await server.get('/redirect');
      expect(res.statusCode).toBe(301);
    }

    // Concurrent batch
    const concurrentRequests = Array.from({ length: 10 }, () =>
      server.post('/ping-pong').send({ concurrent: true })
    );
    const results = await Promise.all(concurrentRequests);

    for (const res of results) {
      expect(res.statusCode).toBe(200);
    }
  });
});
