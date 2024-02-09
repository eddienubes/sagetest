import { getExpressApp } from '../test/utils.js';
import assert from 'assert';
import { rm, writeFile } from 'node:fs/promises';
import request from 'supertest';

const app = getExpressApp();
const supertest = request(app);

console.log('Running test');
const times: any[] = [];
for (let i = 0; i < 1000; i++) {
  const start = performance.now();
  const res = await supertest.post('/ping-pong').send({ name: 'john' });
  times.push({
    value: performance.now() - start,
    index: i
  });

  assert(res.status === 200);
}

await rm('supertest-data.json');
await writeFile('supertest-data.json', JSON.stringify(times));
