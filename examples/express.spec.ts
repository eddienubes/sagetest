import express from 'express';
// import from sagetest in your own project
import { request } from '../src/index.js';

const payload = {
  message: 'I love my mom!'
};

/**
 * Not need to spin up a server manually, sagetest does it for you.
 */
const app = express();
app.get('/', (req, res) => {
  res.cookie('sweet-cookie', 'choco', {
    httpOnly: true
  });
  res.json({
    ...payload,
    requestHeaders: req.headers
  });
});

describe('Express Test Suite', () => {
  it('should respond', async () => {
    const response = await request(app).get('/').auth('user', 'pass');

    expect(response).toEqual({
      body: {
        message: 'I love my mom!',
        requestHeaders: {
          authorization: 'Basic dXNlcjpwYXNz',
          connection: 'close',
          host: expect.stringContaining('localhost')
        }
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
        'content-length': '130',
        'content-type': 'application/json; charset=utf-8',
        date: expect.any(String),
        etag: expect.any(String),
        'set-cookie': 'sweet-cookie=choco; Path=/; HttpOnly',
        'x-powered-by': 'Express'
      },
      location: undefined,
      ok: true,
      redirect: false,
      status: 200,
      statusCode: 200,
      statusText: 'OK',
      text: expect.any(String) // Stringified body
    });
  });
});
