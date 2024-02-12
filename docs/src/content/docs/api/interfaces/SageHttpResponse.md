---
editUrl: false
next: false
prev: false
title: "SageHttpResponse"
---

## Properties

### body

> **body**: `any`

Beware that body could be null if server has redirected etc.

#### Source

[src/SageHttpResponse.ts:8](https://github.com/eddienubes/sagetest/blob/e842b4f/src/SageHttpResponse.ts#L8)

***

### cookies

> **cookies**: `Record`\<`string`, [`CookieOptions`](../type-aliases/CookieOptions.md)\>

Cookies sent by the server. Also, accessible from headers['set-cookie']

#### Source

[src/SageHttpResponse.ts:47](https://github.com/eddienubes/sagetest/blob/e842b4f/src/SageHttpResponse.ts#L47)

***

### error

> **error**: `boolean`

True if the status code is 400 or higher

#### Source

[src/SageHttpResponse.ts:37](https://github.com/eddienubes/sagetest/blob/e842b4f/src/SageHttpResponse.ts#L37)

***

### headers

> **headers**: `Record`\<`string`, `undefined` \| `string` \| `string`[]\>

#### Source

[src/SageHttpResponse.ts:22](https://github.com/eddienubes/sagetest/blob/e842b4f/src/SageHttpResponse.ts#L22)

***

### location?

> **`optional`** **location**: `string`

Location header. Defined only if redirect is true

#### Source

[src/SageHttpResponse.ts:42](https://github.com/eddienubes/sagetest/blob/e842b4f/src/SageHttpResponse.ts#L42)

***

### ok

> **ok**: `boolean`

True if the status code falls in the range 200-299

#### Source

[src/SageHttpResponse.ts:27](https://github.com/eddienubes/sagetest/blob/e842b4f/src/SageHttpResponse.ts#L27)

***

### redirect

> **redirect**: `boolean`

True if the status code is 301, 302, 303, 307, or 308

#### Source

[src/SageHttpResponse.ts:32](https://github.com/eddienubes/sagetest/blob/e842b4f/src/SageHttpResponse.ts#L32)

***

### status

> **status**: `number`

Alias of statusCode

#### Source

[src/SageHttpResponse.ts:17](https://github.com/eddienubes/sagetest/blob/e842b4f/src/SageHttpResponse.ts#L17)

***

### statusCode

> **statusCode**: `number`

#### Source

[src/SageHttpResponse.ts:13](https://github.com/eddienubes/sagetest/blob/e842b4f/src/SageHttpResponse.ts#L13)

***

### statusText

> **statusText**: [`HttpStatusText`](../type-aliases/HttpStatusText.md)

The mapping of status codes to status messages as defined in the HTTP/1.1 specification

#### Source

[src/SageHttpResponse.ts:21](https://github.com/eddienubes/sagetest/blob/e842b4f/src/SageHttpResponse.ts#L21)

***

### text

> **text**: `string`

Text representation of the body

#### Source

[src/SageHttpResponse.ts:12](https://github.com/eddienubes/sagetest/blob/e842b4f/src/SageHttpResponse.ts#L12)
