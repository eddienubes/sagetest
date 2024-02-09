import { getExpressApp } from '../test/utils.js';
import assert from 'assert';
import { request as sagetest } from '../src/index.js';
import { writeFile, rm } from 'node:fs/promises';

const app = getExpressApp();

console.log('Running test');
const times: any[] = [];
for (let i = 0; i < 1000; i++) {
  const start = performance.now();
  const res = await sagetest(app).post('/ping-pong').send({ name: 'john' });
  times.push({
    value: performance.now() - start,
    index: i
  });

  assert(res.status === 200);
}

await rm('sagetest-data.json');
await writeFile('sagetest-data.json', JSON.stringify(times));
