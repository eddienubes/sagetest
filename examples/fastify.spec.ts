import { fastify } from 'fastify';
import { fastifyCookie } from '@fastify/cookie';
// import from sagetest in your own project
import { request } from '../src/index.js';

const payload = {
  message: 'I love my mom!'
};

const fastifyApp = fastify();
fastifyApp.register(fastifyCookie);

fastifyApp.get('/', (request, reply) => {
  reply.setCookie('sweet-cookie', 'choco', {
    httpOnly: true
  });
  reply.send(payload);
});

describe('Fastify Test Suite', () => {
  beforeAll(async () => {
    /**
     * Don't forget to wait until all plugins are registered.
     */
    await fastifyApp.ready();
  });

  it('should respond', async () => {
    /**
     * Don't forget to use .server instead of plain fastify instance.
     */
    const response = await request(fastifyApp.server).get('/');

    expect(response).toEqual({
      body: {
        message: 'I love my mom!'
      },
      cookies: {
        'sweet-cookie': {
          httpOnly: true,
          path: '/',
          value: 'choco'
        }
      },
      error: false,
      headers: {
        connection: 'close',
        'content-length': '28',
        'content-type': 'application/json; charset=utf-8',
        date: expect.any(String),
        'set-cookie': 'sweet-cookie=choco; HttpOnly'
      },
      location: undefined,
      ok: true,
      redirect: false,
      status: 200,
      statusCode: 200,
      statusText: 'OK',
      text: JSON.stringify(payload)
    });
  });
});
