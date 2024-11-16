---
title: \@khulnasoft.com/unisynth-city/middleware/netlify-edge API Reference
---

# [API](/api) &rsaquo; @khulnasoft.com/unisynth-city/middleware/netlify-edge

## createUnisynthCity

```typescript
export declare function createUnisynthCity(
  opts: UnisynthCityNetlifyOptions,
): (request: Request, context: Context) => Promise<Response>;
```

<table><thead><tr><th>

Parameter

</th><th>

Type

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

opts

</td><td>

[UnisynthCityNetlifyOptions](#unisynthcitynetlifyoptions)

</td><td>

</td></tr>
</tbody></table>
**Returns:**

(request: Request, context: Context) =&gt; Promise&lt;Response&gt;

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth-city/src/middleware/netlify-edge/index.ts)

## PlatformNetlify

```typescript
export interface PlatformNetlify extends Partial<Omit<Context, 'next' | 'cookies'>>
```

**Extends:** Partial&lt;Omit&lt;Context, 'next' \| 'cookies'&gt;&gt;

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth-city/src/middleware/netlify-edge/index.ts)

## UnisynthCityNetlifyOptions

```typescript
export interface UnisynthCityNetlifyOptions extends ServerRenderOptions
```

**Extends:** ServerRenderOptions

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth-city/src/middleware/netlify-edge/index.ts)
