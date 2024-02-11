[sagetest](README.md) / Exports

# sagetest

## Table of contents

### Classes

- [Sage](classes/Sage.md)
- [SageException](classes/SageException.md)

### Interfaces

- [FormDataOptions](interfaces/FormDataOptions.md)
- [SageConfig](interfaces/SageConfig.md)
- [SageHttpResponse](interfaces/SageHttpResponse.md)

### Type Aliases

- [CookieOptions](modules.md#cookieoptions)
- [CookiePriorityProperty](modules.md#cookiepriorityproperty)
- [CookieSameSiteProperty](modules.md#cookiesamesiteproperty)
- [DeepPartial](modules.md#deeppartial)
- [HttpCallable](modules.md#httpcallable)
- [HttpMethod](modules.md#httpmethod)
- [HttpStatusText](modules.md#httpstatustext)
- [RequestLineSetter](modules.md#requestlinesetter)
- [SageServer](modules.md#sageserver)
- [ServerListenResolver](modules.md#serverlistenresolver)
- [ServerShutdownCapable](modules.md#servershutdowncapable)
- [ServerSource](modules.md#serversource)
- [SetCookieHeaderProperties](modules.md#setcookieheaderproperties)
- [ThenableReject](modules.md#thenablereject)
- [ThenableResolve](modules.md#thenableresolve)

### Variables

- [HTTP\_METHODS](modules.md#http_methods)
- [HTTP\_STATUS\_TO\_MESSAGE](modules.md#http_status_to_message)
- [SAGE\_DEFAULT\_CONFIG](modules.md#sage_default_config)

### Functions

- [copyObject](modules.md#copyobject)
- [getFilenameFromReadable](modules.md#getfilenamefromreadable)
- [isBinary](modules.md#isbinary)
- [isError](modules.md#iserror)
- [isObject](modules.md#isobject)
- [isOkay](modules.md#isokay)
- [isRedirect](modules.md#isredirect)
- [parseJsonStr](modules.md#parsejsonstr)
- [parseSetCookieHeader](modules.md#parsesetcookieheader)
- [request](modules.md#request)
- [serializeToString](modules.md#serializetostring)
- [statusCodeToMessage](modules.md#statuscodetomessage)
- [wrapArray](modules.md#wraparray)

## Type Aliases

### CookieOptions

Ƭ **CookieOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `domain?` | `string` | Domain name for the cookie. Defaults to the domain name of the app. |
| `expires?` | `Date` | Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie. |
| `httpOnly?` | `boolean` | Flags the cookie to be accessible only by the web server. |
| `maxAge?` | `number` | Convenient option for setting the expiry time relative to the current time in **milliseconds**. |
| `partitioned?` | `boolean` | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#partitioned |
| `path?` | `string` | Path for the cookie. Defaults to “/”. |
| `sameSite?` | [`CookieSameSiteProperty`](modules.md#cookiesamesiteproperty) | Value of the “SameSite” Set-Cookie attribute. **`Link`** https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00#section-4.1.1. |
| `secure?` | `boolean` | Marks the cookie to be used with HTTPS only. |
| `signed?` | `boolean` | Indicates if the cookie should be signed. |
| `value` | `string` | The underlying value of the cookie. |

#### Defined in

[src/types.ts:39](https://github.com/eddienubes/sagetest/blob/8991d9a/src/types.ts#L39)

___

### CookiePriorityProperty

Ƭ **CookiePriorityProperty**: ``"low"`` \| ``"medium"`` \| ``"high"``

#### Defined in

[src/types.ts:68](https://github.com/eddienubes/sagetest/blob/8991d9a/src/types.ts#L68)

___

### CookieSameSiteProperty

Ƭ **CookieSameSiteProperty**: `boolean` \| ``"lax"`` \| ``"strict"`` \| ``"none"``

#### Defined in

[src/types.ts:67](https://github.com/eddienubes/sagetest/blob/8991d9a/src/types.ts#L67)

___

### DeepPartial

Ƭ **DeepPartial**\<`T`\>: `T` extends `object` ? \{ [P in keyof T]?: DeepPartial\<T[P]\> } : `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/types.ts:32](https://github.com/eddienubes/sagetest/blob/8991d9a/src/types.ts#L32)

___

### HttpCallable

Ƭ **HttpCallable**\<`T`\>: \{ [K in typeof HTTP\_METHODS[number]]: RequestLineSetter\<T\> } & [`ServerShutdownCapable`](modules.md#servershutdowncapable)

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/types.ts:19](https://github.com/eddienubes/sagetest/blob/8991d9a/src/types.ts#L19)

___

### HttpMethod

Ƭ **HttpMethod**: `Dispatcher.HttpMethod`

#### Defined in

[src/types.ts:22](https://github.com/eddienubes/sagetest/blob/8991d9a/src/types.ts#L22)

___

### HttpStatusText

Ƭ **HttpStatusText**: typeof [`HTTP_STATUS_TO_MESSAGE`](modules.md#http_status_to_message)[keyof typeof [`HTTP_STATUS_TO_MESSAGE`](modules.md#http_status_to_message)] \| ``"Unknown"``

#### Defined in

[src/constants.ts:76](https://github.com/eddienubes/sagetest/blob/8991d9a/src/constants.ts#L76)

___

### RequestLineSetter

Ƭ **RequestLineSetter**\<`T`\>: (`path`: `string`) => `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`path`): `T`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

##### Returns

`T`

#### Defined in

[src/types.ts:18](https://github.com/eddienubes/sagetest/blob/8991d9a/src/types.ts#L18)

___

### SageServer

Ƭ **SageServer**: `Object`

RequestListener and Server are both acceptable because Server implements ServerOptions interface

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `launched` | `boolean` | - |
| `listenResolver` | [`ServerListenResolver`](modules.md#serverlistenresolver) | Returns a promise that resolves when server is ready to accept connections |
| `server` | `HttpServer` | - |

#### Defined in

[src/types.ts:9](https://github.com/eddienubes/sagetest/blob/8991d9a/src/types.ts#L9)

___

### ServerListenResolver

Ƭ **ServerListenResolver**: () => `Promise`\<`void`\>

#### Type declaration

▸ (): `Promise`\<`void`\>

##### Returns

`Promise`\<`void`\>

#### Defined in

[src/types.ts:17](https://github.com/eddienubes/sagetest/blob/8991d9a/src/types.ts#L17)

___

### ServerShutdownCapable

Ƭ **ServerShutdownCapable**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `shutdown` | () => `Promise`\<`void`\> | Shutdowns |

#### Defined in

[src/types.ts:23](https://github.com/eddienubes/sagetest/blob/8991d9a/src/types.ts#L23)

___

### ServerSource

Ƭ **ServerSource**: `HttpServer` \| `RequestListener`

#### Defined in

[src/types.ts:5](https://github.com/eddienubes/sagetest/blob/8991d9a/src/types.ts#L5)

___

### SetCookieHeaderProperties

Ƭ **SetCookieHeaderProperties**: ``"Domain"`` \| ``"Expires"`` \| ``"HttpOnly"`` \| ``"Max-Age"`` \| ``"Partitioned"`` \| ``"Path"`` \| ``"SameSite"`` \| ``"Secure"``

#### Defined in

[src/types.ts:69](https://github.com/eddienubes/sagetest/blob/8991d9a/src/types.ts#L69)

___

### ThenableReject

Ƭ **ThenableReject**: (`reason?`: `unknown`) => `void`

#### Type declaration

▸ (`reason?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `reason?` | `unknown` |

##### Returns

`void`

#### Defined in

[src/types.ts:31](https://github.com/eddienubes/sagetest/blob/8991d9a/src/types.ts#L31)

___

### ThenableResolve

Ƭ **ThenableResolve**\<`T`\>: (`value`: `T` \| `PromiseLike`\<`T`\>) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`value`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` \| `PromiseLike`\<`T`\> |

##### Returns

`void`

#### Defined in

[src/types.ts:30](https://github.com/eddienubes/sagetest/blob/8991d9a/src/types.ts#L30)

## Variables

### HTTP\_METHODS

• `Const` **HTTP\_METHODS**: readonly [``"get"``, ``"post"``, ``"put"``, ``"head"``, ``"delete"``, ``"options"``, ``"patch"``, ``"search"``]

#### Defined in

[src/constants.ts:4](https://github.com/eddienubes/sagetest/blob/8991d9a/src/constants.ts#L4)

___

### HTTP\_STATUS\_TO\_MESSAGE

• `Const` **HTTP\_STATUS\_TO\_MESSAGE**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `100` | ``"Continue"`` |
| `101` | ``"Switching Protocols"`` |
| `102` | ``"Processing"`` |
| `103` | ``"Early Hints"`` |
| `200` | ``"OK"`` |
| `201` | ``"Created"`` |
| `202` | ``"Accepted"`` |
| `203` | ``"Non Authoritative Information"`` |
| `204` | ``"No Content"`` |
| `205` | ``"Reset Content"`` |
| `206` | ``"Partial Content"`` |
| `207` | ``"Multi-Status"`` |
| `300` | ``"Multiple Choices"`` |
| `301` | ``"Moved Permanently"`` |
| `302` | ``"Moved Temporarily"`` |
| `303` | ``"See Other"`` |
| `304` | ``"Not Modified"`` |
| `305` | ``"Use Proxy"`` |
| `307` | ``"Temporary Redirect"`` |
| `308` | ``"Permanent Redirect"`` |
| `400` | ``"Bad Request"`` |
| `401` | ``"Unauthorized"`` |
| `402` | ``"Payment Required"`` |
| `403` | ``"Forbidden"`` |
| `404` | ``"Not Found"`` |
| `405` | ``"Method Not Allowed"`` |
| `406` | ``"Not Acceptable"`` |
| `407` | ``"Proxy Authentication Required"`` |
| `408` | ``"Request Timeout"`` |
| `409` | ``"Conflict"`` |
| `410` | ``"Gone"`` |
| `411` | ``"Length Required"`` |
| `412` | ``"Precondition Failed"`` |
| `413` | ``"Request Entity Too Large"`` |
| `414` | ``"Request-URI Too Long"`` |
| `415` | ``"Unsupported Media Type"`` |
| `416` | ``"Requested Range Not Satisfiable"`` |
| `417` | ``"Expectation Failed"`` |
| `418` | ``"I'm a teapot"`` |
| `419` | ``"Insufficient Space on Resource"`` |
| `420` | ``"Method Failure"`` |
| `421` | ``"Misdirected Request"`` |
| `422` | ``"Unprocessable Entity"`` |
| `423` | ``"Locked"`` |
| `424` | ``"Failed Dependency"`` |
| `426` | ``"Upgrade Required"`` |
| `428` | ``"Precondition Required"`` |
| `429` | ``"Too Many Requests"`` |
| `431` | ``"Request Header Fields Too Large"`` |
| `451` | ``"Unavailable For Legal Reasons"`` |
| `500` | ``"Internal Server Error"`` |
| `501` | ``"Not Implemented"`` |
| `502` | ``"Bad Gateway"`` |
| `503` | ``"Service Unavailable"`` |
| `504` | ``"Gateway Timeout"`` |
| `505` | ``"HTTP Version Not Supported"`` |
| `507` | ``"Insufficient Storage"`` |
| `511` | ``"Network Authentication Required"`` |

#### Defined in

[src/constants.ts:15](https://github.com/eddienubes/sagetest/blob/8991d9a/src/constants.ts#L15)

___

### SAGE\_DEFAULT\_CONFIG

• `Const` **SAGE\_DEFAULT\_CONFIG**: [`SageConfig`](interfaces/SageConfig.md)

#### Defined in

[src/constants.ts:80](https://github.com/eddienubes/sagetest/blob/8991d9a/src/constants.ts#L80)

## Functions

### copyObject

▸ **copyObject**\<`T`\>(`obj`): `T`

Doesn't preserver functions and other non-serializable values

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `T` |

#### Returns

`T`

#### Defined in

[src/utils.ts:83](https://github.com/eddienubes/sagetest/blob/8991d9a/src/utils.ts#L83)

___

### getFilenameFromReadable

▸ **getFilenameFromReadable**(`readable`): ``null`` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `readable` | `Readable` |

#### Returns

``null`` \| `string`

#### Defined in

[src/utils.ts:56](https://github.com/eddienubes/sagetest/blob/8991d9a/src/utils.ts#L56)

___

### isBinary

▸ **isBinary**(`value`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

`boolean`

#### Defined in

[src/utils.ts:48](https://github.com/eddienubes/sagetest/blob/8991d9a/src/utils.ts#L48)

___

### isError

▸ **isError**(`status`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `status` | `number` |

#### Returns

`boolean`

#### Defined in

[src/utils.ts:29](https://github.com/eddienubes/sagetest/blob/8991d9a/src/utils.ts#L29)

___

### isObject

▸ **isObject**(`candidate`): candidate is object

#### Parameters

| Name | Type |
| :------ | :------ |
| `candidate` | `unknown` |

#### Returns

candidate is object

#### Defined in

[src/utils.ts:71](https://github.com/eddienubes/sagetest/blob/8991d9a/src/utils.ts#L71)

___

### isOkay

▸ **isOkay**(`status`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `status` | `number` |

#### Returns

`boolean`

#### Defined in

[src/utils.ts:22](https://github.com/eddienubes/sagetest/blob/8991d9a/src/utils.ts#L22)

___

### isRedirect

▸ **isRedirect**(`status`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `status` | `number` |

#### Returns

`boolean`

#### Defined in

[src/utils.ts:25](https://github.com/eddienubes/sagetest/blob/8991d9a/src/utils.ts#L25)

___

### parseJsonStr

▸ **parseJsonStr**(`jsonString`): ``null`` \| `object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `jsonString` | `string` |

#### Returns

``null`` \| `object`

#### Defined in

[src/utils.ts:38](https://github.com/eddienubes/sagetest/blob/8991d9a/src/utils.ts#L38)

___

### parseSetCookieHeader

▸ **parseSetCookieHeader**(`setCookieHeader?`): `Record`\<`string`, [`CookieOptions`](modules.md#cookieoptions)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `setCookieHeader?` | `string` \| `string`[] |

#### Returns

`Record`\<`string`, [`CookieOptions`](modules.md#cookieoptions)\>

#### Defined in

[src/utils.ts:95](https://github.com/eddienubes/sagetest/blob/8991d9a/src/utils.ts#L95)

___

### request

▸ **request**(`serverSource`, `overrides?`): [`HttpCallable`](modules.md#httpcallable)\<[`Sage`](classes/Sage.md)\>

Generates Sage Assistant for a given HTTP server

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serverSource` | [`ServerSource`](modules.md#serversource) |  |
| `overrides?` | `Object` |  |
| `overrides.dedicated?` | `boolean` | Launch a dedicated server which will be preserved between requests. When you call request(), it will spin up a new server for you. This server will persist throughout testing, so you'll have to shut down it manually via shutdown(). When this option is set to false, sagetest mimics supertest behaviour and spins up a new server for each request, as well as handles its graceful shutdown. **`Default`** ```ts false ``` |
| `overrides.port?` | `number` | Port for the dedicated server. No idea why would anyone want to use this. It's better to use ephemeral ports to avoid conflicts. **`Default`** ```ts 0, which means an ephemeral port ``` |

#### Returns

[`HttpCallable`](modules.md#httpcallable)\<[`Sage`](classes/Sage.md)\>

#### Defined in

[src/index.ts:21](https://github.com/eddienubes/sagetest/blob/8991d9a/src/index.ts#L21)

___

### serializeToString

▸ **serializeToString**(`value`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

`string`

#### Defined in

[src/utils.ts:12](https://github.com/eddienubes/sagetest/blob/8991d9a/src/utils.ts#L12)

___

### statusCodeToMessage

▸ **statusCodeToMessage**(`status`): [`HttpStatusText`](modules.md#httpstatustext)

#### Parameters

| Name | Type |
| :------ | :------ |
| `status` | `number` |

#### Returns

[`HttpStatusText`](modules.md#httpstatustext)

#### Defined in

[src/utils.ts:31](https://github.com/eddienubes/sagetest/blob/8991d9a/src/utils.ts#L31)

___

### wrapArray

▸ **wrapArray**\<`T`\>(`value`): `T`[]

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` \| `T`[] |

#### Returns

`T`[]

#### Defined in

[src/utils.ts:87](https://github.com/eddienubes/sagetest/blob/8991d9a/src/utils.ts#L87)
