import { Bench } from 'tinybench';
import { getExpressApp } from '../test/utils.js';
import { request as sagetest } from '../src/index.js';
import supertest from 'supertest';
import assert from 'assert';

const bench = new Bench();

const app = getExpressApp();

console.log('Running benchmarks...');
bench
  // .add('sagetest file upload', async () => {
  //   const res = await sagetest(app)
  //     .post('/upload')
  //     .attach('picture', 'benchmark/fixtures/cat.jpg');
  //   assert(res.status === 200);
  // })
  // .add('supertest file upload', async () => {
  //   const res = await supertest(app)
  //     .post('/upload')
  //     .attach('picture', 'benchmark/fixtures/cat.jpg');
  //   assert(res.status === 200);
  // })
  .add('supertest POST request', async () => {
    const res = await supertest(app).post('/ping-pong').send({ name: 'john' });
    assert(res.status === 200);
  })
  .add('sagetest POST request', async () => {
    const res = await sagetest(app).post('/ping-pong').send({ name: 'john' });
    assert(res.status === 200);
  });

// make results more reliable, ref: https://github.com/tinylibs/tinybench/pull/50
await bench.warmup();
await bench.run();

console.table(bench.table());
