import { request } from 'sagetest';
import supertest from 'supertest';
import { createApp } from '../server.ts';

const app = createApp();

const payload = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  name: `User ${i}`,
  email: `user${i}@example.com`,
  active: i % 2 === 0
}));

export const jsonBodyTests = {
  supertest: async () => {
    await supertest(app).post('/ping-pong').send(payload).expect(200);
  },
  sagetest: async () => {
    await request(app).post('/ping-pong').send(payload).expect(200);
  }
};
