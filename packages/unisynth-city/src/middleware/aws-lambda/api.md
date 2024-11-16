## API Report File for "@khulnasoft.com/unisynth-city"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

/// <reference types="node" />

import type { EnvGetter } from '@khulnasoft.com/unisynth-city/middleware/request-handler';
import { Http2ServerRequest } from 'http2';
import { IncomingMessage } from 'http';
import { NodeRequestNextFunction } from '@khulnasoft.com/unisynth-city/middleware/node';
import type { UnisynthIntrinsicElements } from '@khulnasoft.com/unisynth';
import type { UnisynthManifest } from '@khulnasoft.com/unisynth/optimizer';
import type { RequestHandler } from '@khulnasoft.com/unisynth-city/middleware/request-handler';
import type { ResolvedManifest } from '@khulnasoft.com/unisynth/optimizer';
import type { ResolveSyncValue } from '@khulnasoft.com/unisynth-city/middleware/request-handler';
import type { ServerRenderOptions } from '@khulnasoft.com/unisynth-city/middleware/request-handler';
import { ServerResponse } from 'http';
import type { SnapshotResult } from '@khulnasoft.com/unisynth';
import type { StreamWriter } from '@khulnasoft.com/unisynth';
import type { SymbolMapperFn } from '@khulnasoft.com/unisynth/optimizer';

// Warning: (ae-forgotten-export) The symbol "AwsOpt" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export function createUnisynthCity(opts: AwsOpt): {
    fixPath: (pathT: string) => string;
    router: (req: IncomingMessage | Http2ServerRequest, res: ServerResponse<IncomingMessage>, next: NodeRequestNextFunction) => Promise<void>;
    staticFile: (req: IncomingMessage | Http2ServerRequest, res: ServerResponse<IncomingMessage>, next: (e?: any) => void) => Promise<void>;
    notFound: (req: IncomingMessage | Http2ServerRequest, res: ServerResponse<IncomingMessage>, next: (e: any) => void) => Promise<void>;
    handle: (req: any, res: any) => void;
};

// @public (undocumented)
export interface PlatformAwsLambda extends Object {
}

// @public (undocumented)
export interface UnisynthCityAwsLambdaOptions extends ServerRenderOptions {
}

// (No @packageDocumentation comment for this package)

```