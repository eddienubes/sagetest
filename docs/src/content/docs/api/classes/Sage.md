---
editUrl: false
next: false
prev: false
title: "Sage"
---

Greetings, I'm Sage - a chainable HTTP Testing Assistant.
Not meant to be used directly.

## Constructors

### new Sage(sageServer, method, path, config)

> **new Sage**(`sageServer`, `method`, `path`, `config`): [`Sage`](Sage.md)

Sets the HTTP method and path for the request.
Not meant to be called directly.

#### Parameters

• **sageServer**: [`SageServer`](../type-aliases/SageServer.md)

• **method**: `HttpMethod`

• **path**: `string`

• **config**: [`SageConfig`](../interfaces/SageConfig.md)

#### Returns

[`Sage`](Sage.md)

#### Source

[src/Sage.ts:45](https://github.com/eddienubes/sagetest/blob/7d90467/src/Sage.ts#L45)

## Methods

### attach()

> **attach**(`field`, `file`, `options`?): `this`

Method is designed to work only with FormData requests.
Cannot be combined with .send().
If file is a string, it will be treated as a path to a file starting from the working directory (process.cwd()).

#### Parameters

• **field**: `string`

• **file**: `string` \| `Readable` \| `Blob` \| `Buffer`

• **options?**: `string` \| [`FormDataOptions`](../interfaces/FormDataOptions.md)

you can pass either object with type and filename or just a string with filename

#### Returns

`this`

#### Throws

SageException if body is already set

#### Source

[src/Sage.ts:179](https://github.com/eddienubes/sagetest/blob/7d90467/src/Sage.ts#L179)

***

### auth()

> **auth**(`usernameOrToken`, `password`?): `this`

If password is provided, Basic Auth header will be added.
If password is not provided, Bearer token header will be added.
Automatically adds Basic or Bearer prefix to the token.

#### Parameters

• **usernameOrToken**: `string`

• **password?**: `string`

#### Returns

`this`

#### Source

[src/Sage.ts:152](https://github.com/eddienubes/sagetest/blob/7d90467/src/Sage.ts#L152)

***

### cookie()

> **cookie**(`key`, `value`): `this`

#### Parameters

• **key**: `string`

• **value**: `string`

#### Returns

`this`

#### Source

[src/Sage.ts:165](https://github.com/eddienubes/sagetest/blob/7d90467/src/Sage.ts#L165)

***

### field()

> **field**(`field`, `value`): `this`

#### Parameters

• **field**: `string`

• **value**: `string` \| `string`[]

#### Returns

`this`

#### Source

[src/Sage.ts:240](https://github.com/eddienubes/sagetest/blob/7d90467/src/Sage.ts#L240)

***

### query()

> **query**(`query`): `this`

Sets query parameters for the request.

#### Parameters

• **query**: `Record`\<`string` \| `number`, `string`\>

#### Returns

`this`

#### Source

[src/Sage.ts:79](https://github.com/eddienubes/sagetest/blob/7d90467/src/Sage.ts#L79)

***

### send()

> **send**(`body`): `this`

Sets body payload for the request.
If body is an object, it will be stringified to JSON. Content-Type will be set to application/json.
If body is a string, it will be used as is. Content-Type will remain plain/text.
If body is a Readable stream, it will be used as is.
If you need to set a different Content-Type, use the set method.

#### Parameters

• **body**: `string` \| `object`

#### Returns

`this`

#### Throws

SageException if formData is already set

#### Source

[src/Sage.ts:93](https://github.com/eddienubes/sagetest/blob/7d90467/src/Sage.ts#L93)

***

### set()

> **set**(`key`, `value`): `this`

Sets a header for the request.
Consider using this at the end of the chain if you want to override any of the defaults.

#### Parameters

• **key**: `string`

• **value**: `string` \| `string`[]

#### Returns

`this`

#### Source

[src/Sage.ts:114](https://github.com/eddienubes/sagetest/blob/7d90467/src/Sage.ts#L114)

***

### then()

> **then**(`resolve`): `Promise`\<`void`\>

#### Parameters

• **resolve**: [`ThenableResolve`](../type-aliases/ThenableResolve.md)\<[`SageHttpResponse`](../interfaces/SageHttpResponse.md)\>

#### Returns

`Promise`\<`void`\>

#### Source

[src/Sage.ts:257](https://github.com/eddienubes/sagetest/blob/7d90467/src/Sage.ts#L257)

***

### fromRequestLine()

> **`static`** **fromRequestLine**(`sageServer`, `method`, `path`, `config`): [`Sage`](Sage.md)

Request Line term is taken from HTTP spec.
https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html

#### Parameters

• **sageServer**: [`SageServer`](../type-aliases/SageServer.md)

• **method**: `HttpMethod`

• **path**: `string`

• **config**: [`SageConfig`](../interfaces/SageConfig.md)

#### Returns

[`Sage`](Sage.md)

#### Source

[src/Sage.ts:322](https://github.com/eddienubes/sagetest/blob/7d90467/src/Sage.ts#L322)
