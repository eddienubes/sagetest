<p align="center">
    <img src="misc/logo.png">
</p>
<hr>
<p align="center">
    Neat and streamlined testing library for node.js HTTP servers powered by <a href="https://github.com/nodejs/undici"><strong>undici</strong></a>.
<p>
<p align="center">
  <a href="https://www.npmjs.com/package/sagetest"><img src="https://img.shields.io/npm/v/sagetest?color=729B1B&label=npm"></a>
  <a href="https://github.com/eddienubes/sagetest/actions/workflows/ci.yml"><img src="https://github.com/eddienubes/sagetest/actions/workflows/ci.yml/badge.svg?branch=main"></a>
  <a href="https://codecov.io/gh/eddienubes/sagetest" ><img src="https://codecov.io/gh/eddienubes/sagetest/graph/badge.svg?token=UFSWU4BEEB"/></a>
<p>

## 🌟 Features

- Yes! This is a reference to my favourite Valorant character, Sage.
- **TypeScript friendly**, exposes both ESM and CJS modules.
- Built on top of [undici](https://github.com/nodejs/undici) for **maximum performance**.
- Provides **easy-to-use**, supertest-like API.
- Supports a **dedicated test server** to reduce the number of instances spawned during testing.
- Supports **Node.js 16.5 and above**.
- **No unnecessary** third-party dependencies.
- Automatically handles **cookie parsing**.

## 🚀 Getting Started

```sh
npm install -D sagetest
yarn add -D sagetest
pnpm add -D sagetest
```

> Sagetest supports Node.js v16.5 and above out of the box.
> Even though **undici**'s support starts from Node.js v18.
> This is possible due to one-liner [polyfills](https://github.com/eddienubes/sagetest/blob/main/src/polyfill.ts) for
> WebAPI Readable/WritableStreams and Blob,
> which were not available at that time globally (globalThis).

## 🎬 Sagetest in action

> There are several other methods which you can find in the [API documentation](http://google.com).
> In general, the usage experience should resemble that of supertest.

#### Express Endpoint Testing

Example usage of **auth** method to set Basic Auth header based on username and password.

```ts
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
```

#### Fastify Endpoint Testing

Example usage of **auth** method to set the Authorization header based on the provided token.
Also, in response, you're able to validate cookies sent by the server.

```ts
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
  reply.send({
    ...payload,
    requestHeaders: request.headers
  });
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
    const response = await request(fastifyApp.server).get('/').auth('jwtToken');

    expect(response).toEqual({
      body: {
        message: 'I love my mom!',
        requestHeaders: {
          authorization: 'Bearer jwtToken',
          connection: 'close',
          host: expect.any(String)
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
        'content-length': '127',
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
      text: expect.any(String) // Stringified body
    });
  });
});
```

## 📚 API Documentation

The API documentation is available [here](http://google.com).
If you need more examples or have some questions, just open an issue or submit a pull request.
I'll be happy to help you out.

## ❤️ Contributing

If you wish to contribute to the evolution of this package,
please feel free to submit your issues or open pull requests.
You are always welcome.
🥰

## License

MIT (c) Eddie Nubes






