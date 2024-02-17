---
title: Introduction
---
> Installation and API of this library in general is super simple and resembles that of supertest.

```sh
npm install -D sagetest
yarn add -D sagetest
pnpm add -D sagetest
```
And then import it like so:
```ts
import { request } from 'sagetest';
```
> Note: default export is not supported, it's a bad practice to have both default and named exports in the same module.