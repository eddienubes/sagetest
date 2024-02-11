---
editUrl: false
next: false
prev: false
title: "request"
---

> **request**(`serverSource`, `overrides`?): [`HttpCallable`](../type-aliases/HttpCallable.md)\<[`Sage`](../classes/Sage.md)\>

Generates Sage Assistant for a given HTTP server

## Parameters

• **serverSource**: [`ServerSource`](../type-aliases/ServerSource.md)

• **overrides?**

• **overrides\.dedicated?**: `boolean`

Launch a dedicated server which will be preserved between requests.
When you call request(), it will spin up a new server for you.
This server will persist throughout testing, so you'll have to shut down it manually via shutdown().
When this option is set to false, sagetest mimics supertest behaviour and spins up a new server for each request,
as well as handles its graceful shutdown.

**Default**
```ts
false
```

• **overrides\.port?**: `number`

Port for the dedicated server.
No idea why would anyone want to use this. It's better to use ephemeral ports to avoid conflicts.

**Default**
```ts
0, which means an ephemeral port
```

## Returns

[`HttpCallable`](../type-aliases/HttpCallable.md)\<[`Sage`](../classes/Sage.md)\>

## Source

[src/index.ts:21](https://github.com/eddienubes/sagetest/blob/02c3b82/src/index.ts#L21)
