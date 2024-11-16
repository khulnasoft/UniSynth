---
title: \@khulnasoft.com/unisynth-city/middleware/vercel-edge API Reference
---

# [API](/api) &rsaquo; @khulnasoft.com/unisynth-city/middleware/vercel-edge

## createUnisynthCity

```typescript
export declare function createUnisynthCity(
  opts: UnisynthCityVercelEdgeOptions,
): (request: Request) => Promise<Response>;
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

[UnisynthCityVercelEdgeOptions](#unisynthcityverceledgeoptions)

</td><td>

</td></tr>
</tbody></table>
**Returns:**

(request: Request) =&gt; Promise&lt;Response&gt;

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth-city/src/middleware/vercel-edge/index.ts)

## PlatformVercel

```typescript
export interface PlatformVercel
```

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth-city/src/middleware/vercel-edge/index.ts)

## UnisynthCityVercelEdgeOptions

```typescript
export interface UnisynthCityVercelEdgeOptions extends ServerRenderOptions
```

**Extends:** ServerRenderOptions

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth-city/src/middleware/vercel-edge/index.ts)
