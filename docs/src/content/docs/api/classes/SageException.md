---
editUrl: false
next: false
prev: false
title: "SageException"
---

## Extends

- `Error`

## Constructors

### new SageException(message, upstream)

> **new SageException**(`message`, `upstream`?): [`SageException`](SageException.md)

#### Parameters

• **message**: `string`

• **upstream?**: `unknown`

#### Returns

[`SageException`](SageException.md)

#### Overrides

`Error.constructor`

#### Source

[src/SageException.ts:4](https://github.com/eddienubes/sagetest/blob/221f70c/src/SageException.ts#L4)

## Properties

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Source

docs/node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### name

> **name**: `string`

#### Inherited from

`Error.name`

#### Source

docs/node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1075

***

### stack?

> **`optional`** **stack**: `string`

#### Inherited from

`Error.stack`

#### Source

docs/node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### upstream?

> **`optional`** **`readonly`** **upstream**: `unknown`

#### Source

[src/SageException.ts:6](https://github.com/eddienubes/sagetest/blob/221f70c/src/SageException.ts#L6)

***

### prepareStackTrace?

> **`static`** **`optional`** **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### Parameters

• **err**: `Error`

• **stackTraces**: `CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`

#### Source

node\_modules/.pnpm/@types+node@20.11.17/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> **`static`** **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Source

node\_modules/.pnpm/@types+node@20.11.17/node\_modules/@types/node/globals.d.ts:30

## Methods

### captureStackTrace()

> **`static`** **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`

#### Source

node\_modules/.pnpm/@types+node@20.11.17/node\_modules/@types/node/globals.d.ts:21
