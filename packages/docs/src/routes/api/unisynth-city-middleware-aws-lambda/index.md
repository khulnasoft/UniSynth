---
title: \@khulnasoft.com/unisynth-city/middleware/aws-lambda API Reference
---

# [API](/api) &rsaquo; @khulnasoft.com/unisynth-city/middleware/aws-lambda

## createUnisynthCity

```typescript
export declare function createUnisynthCity(opts: AwsOpt): {
  fixPath: (pathT: string) => string;
  router: (
    req: import("http").IncomingMessage | import("http2").Http2ServerRequest,
    res: import("http").ServerResponse<import("http").IncomingMessage>,
    next: import("@khulnasoft.com/unisynth-city/middleware/node").NodeRequestNextFunction,
  ) => Promise<void>;
  staticFile: (
    req: import("http").IncomingMessage | import("http2").Http2ServerRequest,
    res: import("http").ServerResponse<import("http").IncomingMessage>,
    next: (e?: any) => void,
  ) => Promise<void>;
  notFound: (
    req: import("http").IncomingMessage | import("http2").Http2ServerRequest,
    res: import("http").ServerResponse<import("http").IncomingMessage>,
    next: (e: any) => void,
  ) => Promise<void>;
  handle: (req: any, res: any) => void;
};
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

AwsOpt

</td><td>

</td></tr>
</tbody></table>
**Returns:**

{ fixPath: (pathT: string) =&gt; string; router: (req: import("http").IncomingMessage \| import("http2").Http2ServerRequest, res: import("http").ServerResponse&lt;import("http").IncomingMessage&gt;, next: import("@khulnasoft.com/unisynth-city/middleware/node").NodeRequestNextFunction) =&gt; Promise&lt;void&gt;; staticFile: (req: import("http").IncomingMessage \| import("http2").Http2ServerRequest, res: import("http").ServerResponse&lt;import("http").IncomingMessage&gt;, next: (e?: any) =&gt; void) =&gt; Promise&lt;void&gt;; notFound: (req: import("http").IncomingMessage \| import("http2").Http2ServerRequest, res: import("http").ServerResponse&lt;import("http").IncomingMessage&gt;, next: (e: any) =&gt; void) =&gt; Promise&lt;void&gt;; handle: (req: any, res: any) =&gt; void; }

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth-city/src/middleware/aws-lambda/index.ts)

## PlatformAwsLambda

```typescript
export interface PlatformAwsLambda extends Object
```

**Extends:** Object

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth-city/src/middleware/aws-lambda/index.ts)

## UnisynthCityAwsLambdaOptions

```typescript
export interface UnisynthCityAwsLambdaOptions extends ServerRenderOptions
```

**Extends:** ServerRenderOptions

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth-city/src/middleware/aws-lambda/index.ts)
