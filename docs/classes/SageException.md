[sagetest](../README.md) / [Exports](../modules.md) / SageException

# Class: SageException

## Hierarchy

- `Error`

  ↳ **`SageException`**

## Table of contents

### Constructors

- [constructor](SageException.md#constructor)

### Properties

- [message](SageException.md#message)
- [name](SageException.md#name)
- [stack](SageException.md#stack)
- [upstream](SageException.md#upstream)
- [prepareStackTrace](SageException.md#preparestacktrace)
- [stackTraceLimit](SageException.md#stacktracelimit)

### Methods

- [captureStackTrace](SageException.md#capturestacktrace)

## Constructors

### constructor

• **new SageException**(`message`, `upstream?`): [`SageException`](SageException.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `upstream?` | `unknown` |

#### Returns

[`SageException`](SageException.md)

#### Overrides

Error.constructor

#### Defined in

[src/SageException.ts:4](https://github.com/eddienubes/sagetest/blob/8991d9a/src/SageException.ts#L4)

## Properties

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/.pnpm/typescript@5.3.3/node_modules/typescript/lib/lib.es5.d.ts:1076

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/.pnpm/typescript@5.3.3/node_modules/typescript/lib/lib.es5.d.ts:1075

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/.pnpm/typescript@5.3.3/node_modules/typescript/lib/lib.es5.d.ts:1077

___

### upstream

• `Optional` `Readonly` **upstream**: `unknown`

#### Defined in

[src/SageException.ts:6](https://github.com/eddienubes/sagetest/blob/8991d9a/src/SageException.ts#L6)

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/.pnpm/@types+node@20.11.17/node_modules/@types/node/globals.d.ts:28

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/.pnpm/@types+node@20.11.17/node_modules/@types/node/globals.d.ts:30

## Methods

### captureStackTrace

▸ **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/.pnpm/@types+node@20.11.17/node_modules/@types/node/globals.d.ts:21
