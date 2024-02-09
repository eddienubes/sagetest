import { bench, expect } from 'vitest';
import { getExpressApp } from '../test/utils.js';
import { request as sagetest } from '../src/index.js';
import supertest from 'supertest';

const app = getExpressApp();

describe('sagetest vs supertest benchmark', () => {
  describe('POST request', () => {
    bench('supertest', async () => {
      const res = await supertest(app)
        .post('/ping-pong')
        .send({ name: 'john' });
      expect(res.status).toBe(200);
      // expect(res.body).toEqual({
      //   message: 'Success!',
      //   body: {
      //     name: 'john'
      //   },
      //   query: {}
      // });
    });
    bench('sagetest', async () => {
      const res = await sagetest(app).post('/ping-pong').send({ name: 'john' });
      expect(res.status).toBe(200);
      // expect(res.body).toEqual({
      //   message: 'Success!',
      //   body: {
      //     name: 'john'
      //   },
      //   query: {}
      // });
    });
  });

  // describe.skip('file upload', () => {
  //   bench(
  //     'sagetest',
  //     async () => {
  //       const res = await sagetest(app)
  //         .post('/upload')
  //         .attach('picture', 'benchmark/fixtures/cat.jpg');
  //
  //       expect(res.status).toBe(200);
  //     },
  //     { time: 1000 * 60 }
  //   );
  //
  //   bench(
  //     'supertest',
  //     async () => {
  //       const res = await supertest(app)
  //         .post('/upload')
  //         .attach('picture', 'benchmark/fixtures/cat.jpg');
  //
  //       expect(res.status).toBe(200);
  //     },
  //     { time: 1000 * 60 }
  //   );
  // });
});
