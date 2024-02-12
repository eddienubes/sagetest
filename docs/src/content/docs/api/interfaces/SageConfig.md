---
editUrl: false
next: false
prev: false
title: "SageConfig"
---

## Properties

### dedicated

> **dedicated**: `boolean`

Launch a dedicated server which will be preserved between requests.
When you call request(), it will spin up a new server for you.
This server will persist throughout testing, so you'll have to shut down it manually via shutdown().
When this option is set to false, sagetest mimics supertest behaviour and spins up a new server for each request,
as well as handles its graceful shutdown.

#### Default

```ts
false
```

#### Source

[src/SageConfig.ts:10](https://github.com/eddienubes/sagetest/blob/221f70c/src/SageConfig.ts#L10)

***

### port

> **port**: `number`

Port for the dedicated server.
No idea why would anyone want to use this. It's better to use ephemeral ports to avoid conflicts.

#### Default

```ts
0, which means an ephemeral port
```

#### Source

[src/SageConfig.ts:17](https://github.com/eddienubes/sagetest/blob/221f70c/src/SageConfig.ts#L17)
