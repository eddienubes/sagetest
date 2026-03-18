import fs from 'node:fs';
import path from 'node:path';
import { request } from 'sagetest';
import supertest from 'supertest';
import { createApp } from '../server.ts';

const app = createApp();
const fixturePath = path.resolve(
  import.meta.dirname,
  '../../../test/fixtures/cat.jpg'
);

export const fileUploadStreamTests = {
  supertest: async () => {
    const stream = fs.createReadStream(fixturePath);
    await supertest(app).post('/upload').attach('picture', stream).expect(200);
  },
  sagetest: async () => {
    const stream = fs.createReadStream(fixturePath);
    await request(app).post('/upload').attach('picture', stream).expect(200);
  }
};
