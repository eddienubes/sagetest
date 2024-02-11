---
editUrl: false
next: false
prev: false
title: "CookieOptions"
---

> **CookieOptions**: `Object`

## Type declaration

### domain?

> **`optional`** **domain**: `string`

Domain name for the cookie. Defaults to the domain name of the app.

### expires?

> **`optional`** **expires**: `Date`

Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie.

### httpOnly?

> **`optional`** **httpOnly**: `boolean`

Flags the cookie to be accessible only by the web server.

### maxAge?

> **`optional`** **maxAge**: `number`

Convenient option for setting the expiry time relative to the current time in **milliseconds**.

### partitioned?

> **`optional`** **partitioned**: `boolean`

https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#partitioned

### path?

> **`optional`** **path**: `string`

Path for the cookie. Defaults to “/”.

### sameSite?

> **`optional`** **sameSite**: [`CookieSameSiteProperty`](CookieSameSiteProperty.md)

Value of the “SameSite” Set-Cookie attribute.

#### Link

https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00#section-4.1.1.

### secure?

> **`optional`** **secure**: `boolean`

Marks the cookie to be used with HTTPS only.

### signed?

> **`optional`** **signed**: `boolean`

Indicates if the cookie should be signed.

### value

> **value**: `string`

The underlying value of the cookie.

## Source

[src/types.ts:39](https://github.com/eddienubes/sagetest/blob/02c3b82/src/types.ts#L39)
