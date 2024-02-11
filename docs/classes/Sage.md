[sagetest](../README.md) / [Exports](../modules.md) / Sage

# Class: Sage

Greetings, I'm Sage - a chainable HTTP Testing Assistant.
Not meant to be used directly.

## Table of contents

### Constructors

- [constructor](Sage.md#constructor)

### Properties

- [client](Sage.md#client)
- [config](Sage.md#config)
- [request](Sage.md#request)
- [sageServer](Sage.md#sageserver)

### Methods

- [attach](Sage.md#attach)
- [auth](Sage.md#auth)
- [cookie](Sage.md#cookie)
- [field](Sage.md#field)
- [getServerPort](Sage.md#getserverport)
- [query](Sage.md#query)
- [send](Sage.md#send)
- [set](Sage.md#set)
- [then](Sage.md#then)
- [fromRequestLine](Sage.md#fromrequestline)

## Constructors

### constructor

• **new Sage**(`sageServer`, `method`, `path`, `config`): [`Sage`](Sage.md)

Sets the HTTP method and path for the request.
Not meant to be called directly.

#### Parameters

| Name | Type |
| :------ | :------ |
| `sageServer` | [`SageServer`](../modules.md#sageserver) |
| `method` | `HttpMethod` |
| `path` | `string` |
| `config` | [`SageConfig`](../interfaces/SageConfig.md) |

#### Returns

[`Sage`](Sage.md)

#### Defined in

[src/Sage.ts:45](https://github.com/eddienubes/sagetest/blob/8991d9a/src/Sage.ts#L45)

## Properties

### client

• `Private` **client**: `Client`

#### Defined in

[src/Sage.ts:35](https://github.com/eddienubes/sagetest/blob/8991d9a/src/Sage.ts#L35)

___

### config

• `Private` **config**: [`SageConfig`](../interfaces/SageConfig.md)

#### Defined in

[src/Sage.ts:33](https://github.com/eddienubes/sagetest/blob/8991d9a/src/Sage.ts#L33)

___

### request

• `Private` **request**: `SageHttpRequest` = `{}`

#### Defined in

[src/Sage.ts:34](https://github.com/eddienubes/sagetest/blob/8991d9a/src/Sage.ts#L34)

___

### sageServer

• `Private` **sageServer**: [`SageServer`](../modules.md#sageserver)

#### Defined in

[src/Sage.ts:32](https://github.com/eddienubes/sagetest/blob/8991d9a/src/Sage.ts#L32)

## Methods

### attach

▸ **attach**(`field`, `file`, `options?`): `this`

Method is designed to work only with FormData requests.
Cannot be combined with .send().
If file is a string, it will be treated as a path to a file starting from the working directory (process.cwd()).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `field` | `string` |  |
| `file` | `string` \| `Readable` \| `Blob` \| `Buffer` |  |
| `options?` | `string` \| [`FormDataOptions`](../interfaces/FormDataOptions.md) | you can pass either object with type and filename or just a string with filename |

#### Returns

`this`

**`Throws`**

SageException if body is already set

#### Defined in

[src/Sage.ts:179](https://github.com/eddienubes/sagetest/blob/8991d9a/src/Sage.ts#L179)

___

### auth

▸ **auth**(`usernameOrToken`, `password?`): `this`

If password is provided, Basic Auth header will be added.
If password is not provided, Bearer token header will be added.
Automatically adds Basic or Bearer prefix to the token.

#### Parameters

| Name | Type |
| :------ | :------ |
| `usernameOrToken` | `string` |
| `password?` | `string` |

#### Returns

`this`

#### Defined in

[src/Sage.ts:152](https://github.com/eddienubes/sagetest/blob/8991d9a/src/Sage.ts#L152)

___

### cookie

▸ **cookie**(`key`, `value`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `string` |

#### Returns

`this`

#### Defined in

[src/Sage.ts:165](https://github.com/eddienubes/sagetest/blob/8991d9a/src/Sage.ts#L165)

___

### field

▸ **field**(`field`, `value`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |
| `value` | `string` \| `string`[] |

#### Returns

`this`

#### Defined in

[src/Sage.ts:240](https://github.com/eddienubes/sagetest/blob/8991d9a/src/Sage.ts#L240)

___

### getServerPort

▸ **getServerPort**(`server`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `Server`\<typeof `IncomingMessage`, typeof `ServerResponse`\> |

#### Returns

`number`

#### Defined in

[src/Sage.ts:302](https://github.com/eddienubes/sagetest/blob/8991d9a/src/Sage.ts#L302)

___

### query

▸ **query**(`query`): `this`

Sets query parameters for the request.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `Record`\<`string` \| `number`, `string`\> |

#### Returns

`this`

#### Defined in

[src/Sage.ts:79](https://github.com/eddienubes/sagetest/blob/8991d9a/src/Sage.ts#L79)

___

### send

▸ **send**(`body`): `this`

Sets body payload for the request.
If body is an object, it will be stringified to JSON. Content-Type will be set to application/json.
If body is a string, it will be used as is. Content-Type will remain plain/text.
If body is a Readable stream, it will be used as is.
If you need to set a different Content-Type, use the set method.

#### Parameters

| Name | Type |
| :------ | :------ |
| `body` | `string` \| `object` |

#### Returns

`this`

**`Throws`**

SageException if formData is already set

#### Defined in

[src/Sage.ts:93](https://github.com/eddienubes/sagetest/blob/8991d9a/src/Sage.ts#L93)

___

### set

▸ **set**(`key`, `value`): `this`

Sets a header for the request.
Consider using this at the end of the chain if you want to override any of the defaults.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `string` \| `string`[] |

#### Returns

`this`

#### Defined in

[src/Sage.ts:114](https://github.com/eddienubes/sagetest/blob/8991d9a/src/Sage.ts#L114)

___

### then

▸ **then**(`resolve`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `resolve` | [`ThenableResolve`](../modules.md#thenableresolve)\<[`SageHttpResponse`](../interfaces/SageHttpResponse.md)\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/Sage.ts:257](https://github.com/eddienubes/sagetest/blob/8991d9a/src/Sage.ts#L257)

___

### fromRequestLine

▸ **fromRequestLine**(`sageServer`, `method`, `path`, `config`): [`Sage`](Sage.md)

Request Line term is taken from HTTP spec.
https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html

#### Parameters

| Name | Type |
| :------ | :------ |
| `sageServer` | [`SageServer`](../modules.md#sageserver) |
| `method` | `HttpMethod` |
| `path` | `string` |
| `config` | [`SageConfig`](../interfaces/SageConfig.md) |

#### Returns

[`Sage`](Sage.md)

#### Defined in

[src/Sage.ts:322](https://github.com/eddienubes/sagetest/blob/8991d9a/src/Sage.ts#L322)
