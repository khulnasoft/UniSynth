---
title: \@khulnasoft.com/unisynth-city/middleware/cloudflare-pages API Reference
---

# [API](/api) &rsaquo; @khulnasoft.com/unisynth-city/middleware/cloudflare-pages

## createUnisynthCity

```typescript
export declare function createUnisynthCity(opts: UnisynthCityCloudflarePagesOptions): (
  request: PlatformCloudflarePages["request"],
  env: PlatformCloudflarePages["env"] & {
    ASSETS: {
      fetch: (req: Request) => Response;
    };
  },
  ctx: PlatformCloudflarePages["ctx"],
) => Promise<Response>;
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

[UnisynthCityCloudflarePagesOptions](#unisynthcitycloudflarepagesoptions)

</td><td>

</td></tr>
</tbody></table>
**Returns:**

(request: [PlatformCloudflarePages](#platformcloudflarepages)['request'], env: [PlatformCloudflarePages](#platformcloudflarepages)['env'] &amp; { ASSETS: { fetch: (req: Request) =&gt; Response; }; }, ctx: [PlatformCloudflarePages](#platformcloudflarepages)['ctx']) =&gt; Promise&lt;Response&gt;

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth-city/src/middleware/cloudflare-pages/index.ts)

## PlatformCloudflarePages

```typescript
export interface PlatformCloudflarePages
```

<table><thead><tr><th>

Property

</th><th>

Modifiers

</th><th>

Type

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

[ctx](#)

</td><td>

</td><td>

{ waitUntil: (promise: Promise&lt;any&gt;) =&gt; void; }

</td><td>

</td></tr>
<tr><td>

[env?](#)

</td><td>

</td><td>

Record&lt;string, any&gt;

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[request](#)

</td><td>

</td><td>

Request

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth-city/src/middleware/cloudflare-pages/index.ts)

## UnisynthCityCloudflarePagesOptions

```typescript
export interface UnisynthCityCloudflarePagesOptions extends ServerRenderOptions
```

**Extends:** ServerRenderOptions

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth-city/src/middleware/cloudflare-pages/index.ts)
