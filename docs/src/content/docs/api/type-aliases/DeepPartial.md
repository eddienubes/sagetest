---
editUrl: false
next: false
prev: false
title: "DeepPartial"
---

> **DeepPartial**\<`T`\>: `T` extends `object` ? `{ [P in keyof T]?: DeepPartial<T[P]> }` : `T`

## Type parameters

• **T**

## Source

[src/types.ts:32](https://github.com/eddienubes/sagetest/blob/c1a99be/src/types.ts#L32)
