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

## Features

- Yes! This is a reference to my favourite Valorant character, Sage.
- TypeScript friendly, exposes both ESM and CJS modules.
- Built-in on top of [undici](https://github.com/nodejs/undici) for maximum performance.
- Provides easy to use, supertest-like API.
- Support for a dedicated test server to reduce the number of instances spawned during testing.
- Supports Node.js 16.5 and above.
- No unnecessary third-party dependencies.
- Automatically handles cookie parsing.

## Getting Started

```sh
npm install -D sagetest
yarn add -D sagetest
pnpm add -D sagetest
```
> Sagetest supports Node.js v16.5 and above out of the box.
> Even though **undici**'s support starts from Node.js v18.
This is possible due to one-liner [polyfills](https://github.com/eddienubes/sagetest/blob/main/src/polyfill.ts) for WebAPI Readable/WritableStreams and Blob,
> which were not available at that time globally (globalThis).

## Sagetest in action
> There're several other methods which 
### POST endpoint testing






