## API Report File for "@khulnasoft.com/unisynth-city"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import type { ServerRenderOptions } from '@khulnasoft.com/unisynth-city/middleware/request-handler';

// @public (undocumented)
export function createUnisynthCity(opts: UnisynthCityCloudflarePagesOptions): (request: PlatformCloudflarePages['request'], env: PlatformCloudflarePages['env'] & {
    ASSETS: {
        fetch: (req: Request) => Response;
    };
}, ctx: PlatformCloudflarePages['ctx']) => Promise<Response>;

// @public (undocumented)
export interface PlatformCloudflarePages {
    // (undocumented)
    ctx: {
        waitUntil: (promise: Promise<any>) => void;
    };
    // (undocumented)
    env?: Record<string, any>;
    // (undocumented)
    request: Request;
}

// @public (undocumented)
export interface UnisynthCityCloudflarePagesOptions extends ServerRenderOptions {
}

// (No @packageDocumentation comment for this package)

```