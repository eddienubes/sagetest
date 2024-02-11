---
title: Dedicated Mode
---

### Standard behavior

The way this library works by default is it spins up a server for each request, as well as handles its graceful
shutdown.

### Dedicated mode

To speed up your tests and reduce the number of instances spawned in huge code bases, you can make use of
the `dedicated` false.

```ts
// Import and create Sage request assistant instance with the dedicated mode enabled
import { request } from 'sagetest';

const app = getMyExpressApp();
// Server is launched right here
const requestDedicated = request(app, { dedicated: true }); 
```

Because of that, you'll have to manually shut down this server after all tests are done.

```ts
describe('My Test Suite', () => {
  afterAll(async () => {
    // Server is shut down right here
    await requestDedicated.shutdown();
  });

  it('should request', async () => {
    const res = await requestDedicated.get('/').auth('user', 'pass');

    expect(res.statusCode).toBe(200);
  });
});
```

You can also use alias **dedicated** to avoid passing **dedicated: true** flag every time.

```ts
// Import and create Sage request assistant instance with the dedicated mode enabled
import { dedicated } from 'sagetest';

const app = getMyExpressApp();
// Server is launched right here
const request = dedicated(app);
// Ready to use!
```