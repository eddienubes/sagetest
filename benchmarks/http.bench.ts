import { bench, boxplot, do_not_optimize, run, summary } from 'mitata';
import { createServer } from 'node:http';
import supertest from 'supertest';
import { getExpressApp } from '../test/utils.js';
import { dedicated } from '../src/index.js';

// Only dedicated/pre-listening servers are compared: spinning up a server per request
// (supertest(app) / sagetest request(app)) exhausts ephemeral ports within a few thousand iterations.
const app = getExpressApp();

// Pre-listening server for supertest, the equivalent of sagetest's dedicated mode
const server = createServer(app);
await new Promise<void>((resolve) => server.listen(0, resolve));

const sageDedicated = dedicated(app);

const body = {
  field: 1,
  anotherField: 2,
  yetAnotherField: '3',
  nested: {
    field: 4,
    anotherField: 5,
    yetAnotherField: '6',
    nested: { someField: 7, anotherField: 8, yetAnotherField: '9' }
  },
  date: new Date().toISOString(),
  array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
};

const headers = {
  'some-header': 'some-value',
  'another-header': 'another-value',
  'yet-another-header': 'yet-another-value'
};

// Multer writes uploads to disk, so this scenario is mostly server-bound
const file = 'test/fixtures/cat.jpg';

boxplot(() => {
  summary(() => {
    bench('supertest(server) json', async () => {
      do_not_optimize(
        await supertest(server).post('/ping-pong').send(body).set(headers)
      );
    });
    bench('sagetest dedicated json', async () => {
      do_not_optimize(
        await sageDedicated.post('/ping-pong').send(body).set(headers)
      );
    });
  });

  summary(() => {
    bench('supertest(server) multipart', async () => {
      do_not_optimize(
        await supertest(server).post('/upload').attach('picture', file)
      );
    });
    bench('sagetest dedicated multipart', async () => {
      do_not_optimize(
        await sageDedicated.post('/upload').attach('picture', file)
      );
    });
  });
});

await run();

server.close();
await sageDedicated.close();
