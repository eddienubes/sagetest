---
title: 🍪 Cookies
---

> This section explains how to test cookies with Sage.

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