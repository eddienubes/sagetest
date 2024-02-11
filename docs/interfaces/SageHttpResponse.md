[sagetest](../README.md) / [Exports](../modules.md) / SageHttpResponse

# Interface: SageHttpResponse

## Table of contents

### Properties

- [body](SageHttpResponse.md#body)
- [cookies](SageHttpResponse.md#cookies)
- [error](SageHttpResponse.md#error)
- [headers](SageHttpResponse.md#headers)
- [location](SageHttpResponse.md#location)
- [ok](SageHttpResponse.md#ok)
- [redirect](SageHttpResponse.md#redirect)
- [status](SageHttpResponse.md#status)
- [statusCode](SageHttpResponse.md#statuscode)
- [statusText](SageHttpResponse.md#statustext)
- [text](SageHttpResponse.md#text)

## Properties

### body

• **body**: `any`

Beware that body could be null if server has redirected etc.

#### Defined in

[src/SageHttpResponse.ts:8](https://github.com/eddienubes/sagetest/blob/8991d9a/src/SageHttpResponse.ts#L8)

___

### cookies

• **cookies**: `Record`\<`string`, [`CookieOptions`](../modules.md#cookieoptions)\>

Cookies sent by the server. Also, accessible from headers['set-cookie']

#### Defined in

[src/SageHttpResponse.ts:47](https://github.com/eddienubes/sagetest/blob/8991d9a/src/SageHttpResponse.ts#L47)

___

### error

• **error**: `boolean`

True if the status code is 400 or higher

#### Defined in

[src/SageHttpResponse.ts:37](https://github.com/eddienubes/sagetest/blob/8991d9a/src/SageHttpResponse.ts#L37)

___

### headers

• **headers**: `Record`\<`string`, `undefined` \| `string` \| `string`[]\>

#### Defined in

[src/SageHttpResponse.ts:22](https://github.com/eddienubes/sagetest/blob/8991d9a/src/SageHttpResponse.ts#L22)

___

### location

• `Optional` **location**: `string`

Location header. Defined only if redirect is true

#### Defined in

[src/SageHttpResponse.ts:42](https://github.com/eddienubes/sagetest/blob/8991d9a/src/SageHttpResponse.ts#L42)

___

### ok

• **ok**: `boolean`

True if the status code falls in the range 200-299

#### Defined in

[src/SageHttpResponse.ts:27](https://github.com/eddienubes/sagetest/blob/8991d9a/src/SageHttpResponse.ts#L27)

___

### redirect

• **redirect**: `boolean`

True if the status code is 301, 302, 303, 307, or 308

#### Defined in

[src/SageHttpResponse.ts:32](https://github.com/eddienubes/sagetest/blob/8991d9a/src/SageHttpResponse.ts#L32)

___

### status

• **status**: `number`

Alias of statusCode

#### Defined in

[src/SageHttpResponse.ts:17](https://github.com/eddienubes/sagetest/blob/8991d9a/src/SageHttpResponse.ts#L17)

___

### statusCode

• **statusCode**: `number`

#### Defined in

[src/SageHttpResponse.ts:13](https://github.com/eddienubes/sagetest/blob/8991d9a/src/SageHttpResponse.ts#L13)

___

### statusText

• **statusText**: [`HttpStatusText`](../modules.md#httpstatustext)

The mapping of status codes to status messages as defined in the HTTP/1.1 specification

#### Defined in

[src/SageHttpResponse.ts:21](https://github.com/eddienubes/sagetest/blob/8991d9a/src/SageHttpResponse.ts#L21)

___

### text

• **text**: `string`

Text representation of the body

#### Defined in

[src/SageHttpResponse.ts:12](https://github.com/eddienubes/sagetest/blob/8991d9a/src/SageHttpResponse.ts#L12)
