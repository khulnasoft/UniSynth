---
title: \@khulnasoft.com/unisynth/testing API Reference
---

# [API](/api) &rsaquo; @khulnasoft.com/unisynth/testing

## createDOM

CreatePlatform and CreateDocument

```typescript
createDOM: ({ html }?: { html?: string }) =>
  Promise<{
    render: (
      jsxElement: JSXOutput,
    ) => Promise<import("@khulnasoft.com/unisynth").RenderResult>;
    screen: HTMLElement;
    userEvent: (
      queryOrElement: string | Element | keyof HTMLElementTagNameMap | null,
      eventNameCamel: string | keyof WindowEventMap,
      eventPayload?: any,
    ) => Promise<void>;
  }>;
```

<table><thead><tr><th>

Parameter

</th><th>

Type

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

{ html }

</td><td>

{ html?: string; }

</td><td>

_(Optional)_

</td></tr>
</tbody></table>
**Returns:**

Promise&lt;{ render: (jsxElement: JSXOutput) =&gt; Promise&lt;import("@khulnasoft.com/unisynth").RenderResult&gt;; screen: HTMLElement; userEvent: (queryOrElement: string \| Element \| keyof HTMLElementTagNameMap \| null, eventNameCamel: string \| keyof WindowEventMap, eventPayload?: any) =&gt; Promise&lt;void&gt;; }&gt;

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/testing/library.ts)
