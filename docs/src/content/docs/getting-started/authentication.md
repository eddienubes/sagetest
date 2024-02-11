---
title: Authentication
---
> This section explains how to use the `auth` method to set Basic Auth header based on username and password as well as JWT token.

### Let's set Basic Auth header first
```ts
describe('cookies', () => {
  it('should parse cookies properly for response', async () => {
    const res = await request(expressApp).get('/cookie');

    expect(res).toMatchObject({
      headers: {
        'set-cookie': [
          'name=express; Path=/',
          'name=I%20love%20my%20mom!; Path=/; HttpOnly'
        ]
      },
      cookies: {
        name: {
          httpOnly: true,
          path: '/',
          value: 'I love my mom!'
        }
      }
    });
  });

  it('should parse cookies properly for request', async () => {
    const res = await request(expressApp)
      .get('/cookie')
      .cookie('name', 'fastify');

    expect(res).toMatchObject({
      body: {
        reqHeaders: {
          cookie: 'name=fastify'
        }
      },
      cookies: {
        name: {
          httpOnly: true,
          path: '/',
          value: 'I love my mom!'
        }
      }
    });
  });
});
```
Let's see how it works with JWT token.
```ts
it('should set bearer token', async () => {
  const res = await request(expressApp).get('/cookie').auth('token');

  expect(res).toMatchObject({
    body: {
      reqHeaders: {
        authorization: 'Bearer token'
      }
    }
  });
});
```

As you can see, it's dead simple and resembles supertest-API.