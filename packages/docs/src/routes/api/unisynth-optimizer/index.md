---
title: \@khulnasoft.com/unisynth/optimizer API Reference
---

# [API](/api) &rsaquo; @khulnasoft.com/unisynth/optimizer

## basename

```typescript
basename(path: string, ext?: string): string;
```

<table><thead><tr><th>

Parameter

</th><th>

Type

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

path

</td><td>

string

</td><td>

</td></tr>
<tr><td>

ext

</td><td>

string

</td><td>

_(Optional)_

</td></tr>
</tbody></table>
**Returns:**

string

## ComponentEntryStrategy

```typescript
export interface ComponentEntryStrategy
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

[manual?](#)

</td><td>

</td><td>

Record&lt;string, string&gt;

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[type](#)

</td><td>

</td><td>

'component'

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## createOptimizer

```typescript
createOptimizer: (optimizerOptions?: OptimizerOptions) => Promise<Optimizer>;
```

<table><thead><tr><th>

Parameter

</th><th>

Type

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

optimizerOptions

</td><td>

[OptimizerOptions](#optimizeroptions)

</td><td>

_(Optional)_

</td></tr>
</tbody></table>
**Returns:**

Promise&lt;[Optimizer](#optimizer)&gt;

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/optimizer.ts)

## Diagnostic

```typescript
export interface Diagnostic
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

[category](#)

</td><td>

</td><td>

[DiagnosticCategory](#diagnosticcategory)

</td><td>

</td></tr>
<tr><td>

[code](#)

</td><td>

</td><td>

string \| null

</td><td>

</td></tr>
<tr><td>

[file](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[highlights](#)

</td><td>

</td><td>

[SourceLocation](#sourcelocation)[]

</td><td>

</td></tr>
<tr><td>

[message](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[scope](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[suggestions](#)

</td><td>

</td><td>

string[] \| null

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## DiagnosticCategory

```typescript
export type DiagnosticCategory = "error" | "warning" | "sourceError";
```

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## dirname

```typescript
dirname(path: string): string;
```

<table><thead><tr><th>

Parameter

</th><th>

Type

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

path

</td><td>

string

</td><td>

</td></tr>
</tbody></table>
**Returns:**

string

## EntryStrategy

```typescript
export type EntryStrategy =
  | InlineEntryStrategy
  | HoistEntryStrategy
  | SingleEntryStrategy
  | HookEntryStrategy
  | SegmentEntryStrategy
  | ComponentEntryStrategy
  | SmartEntryStrategy;
```

**References:** [InlineEntryStrategy](#inlineentrystrategy), [SingleEntryStrategy](#singleentrystrategy), [SegmentEntryStrategy](#segmententrystrategy), [ComponentEntryStrategy](#componententrystrategy), [SmartEntryStrategy](#smartentrystrategy)

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## ExperimentalFeatures

> This API is provided as an alpha preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.

Use `__EXPERIMENTAL__.x` to check if feature `x` is enabled. It will be replaced with `true` or `false` via an exact string replacement.

Add experimental features to this enum definition.

```typescript
export declare enum ExperimentalFeatures
```

<table><thead><tr><th>

Member

</th><th>

Value

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

noSPA

</td><td>

`"noSPA"`

</td><td>

**_(ALPHA)_** Disable SPA navigation handler in Unisynth City

</td></tr>
<tr><td>

preventNavigate

</td><td>

`"preventNavigate"`

</td><td>

**_(ALPHA)_** Enable the usePreventNavigate hook

</td></tr>
<tr><td>

valibot

</td><td>

`"valibot"`

</td><td>

**_(ALPHA)_** Enable the Valibot form validation

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/plugins/plugin.ts)

## extname

```typescript
extname(path: string): string;
```

<table><thead><tr><th>

Parameter

</th><th>

Type

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

path

</td><td>

string

</td><td>

</td></tr>
</tbody></table>
**Returns:**

string

## format

```typescript
format(pathObject: {
        root: string;
        dir: string;
        base: string;
        ext: string;
        name: string;
    }): string;
```

<table><thead><tr><th>

Parameter

</th><th>

Type

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

pathObject

</td><td>

{ root: string; dir: string; base: string; ext: string; name: string; }

</td><td>

</td></tr>
</tbody></table>
**Returns:**

string

## GlobalInjections

```typescript
export interface GlobalInjections
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

[attributes?](#)

</td><td>

</td><td>

{ [key: string]: string; }

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[location](#)

</td><td>

</td><td>

'head' \| 'body'

</td><td>

</td></tr>
<tr><td>

[tag](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## InlineEntryStrategy

```typescript
export interface InlineEntryStrategy
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

[type](#)

</td><td>

</td><td>

'inline'

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## InsightManifest

```typescript
export interface InsightManifest
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

[manual](#)

</td><td>

</td><td>

Record&lt;string, string&gt;

</td><td>

</td></tr>
<tr><td>

[prefetch](#)

</td><td>

</td><td>

{ route: string; symbols: string[]; }[]

</td><td>

</td></tr>
<tr><td>

[type](#)

</td><td>

</td><td>

'smart'

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## isAbsolute

```typescript
isAbsolute(path: string): boolean;
```

<table><thead><tr><th>

Parameter

</th><th>

Type

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

path

</td><td>

string

</td><td>

</td></tr>
</tbody></table>
**Returns:**

boolean

## join

```typescript
join(...paths: string[]): string;
```

<table><thead><tr><th>

Parameter

</th><th>

Type

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

paths

</td><td>

string[]

</td><td>

</td></tr>
</tbody></table>
**Returns:**

string

## MinifyMode

```typescript
export type MinifyMode = "simplify" | "none";
```

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## normalize

```typescript
normalize(path: string): string;
```

<table><thead><tr><th>

Parameter

</th><th>

Type

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

path

</td><td>

string

</td><td>

</td></tr>
</tbody></table>
**Returns:**

string

## noSPA

## Optimizer

```typescript
export interface Optimizer
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

[sys](#)

</td><td>

</td><td>

[OptimizerSystem](#optimizersystem)

</td><td>

Optimizer system use. This can be updated with a custom file system.

</td></tr>
</tbody></table>

<table><thead><tr><th>

Method

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

[transformFs(opts)](#optimizer-transformfs)

</td><td>

Transforms the directory from the file system.

</td></tr>
<tr><td>

[transformFsSync(opts)](#optimizer-transformfssync)

</td><td>

Transforms the directory from the file system.

</td></tr>
<tr><td>

[transformModules(opts)](#optimizer-transformmodules)

</td><td>

Transforms the input code string, does not access the file system.

</td></tr>
<tr><td>

[transformModulesSync(opts)](#optimizer-transformmodulessync)

</td><td>

Transforms the input code string, does not access the file system.

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## OptimizerOptions

```typescript
export interface OptimizerOptions
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

[binding?](#)

</td><td>

</td><td>

any

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[inlineStylesUpToBytes?](#)

</td><td>

</td><td>

number

</td><td>

_(Optional)_ Inline the global styles if they're smaller than this

</td></tr>
<tr><td>

[sourcemap?](#)

</td><td>

</td><td>

boolean

</td><td>

_(Optional)_ Enable sourcemaps

</td></tr>
<tr><td>

[sys?](#)

</td><td>

</td><td>

[OptimizerSystem](#optimizersystem)

</td><td>

_(Optional)_

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## OptimizerSystem

```typescript
export interface OptimizerSystem
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

[cwd](#)

</td><td>

</td><td>

() =&gt; string

</td><td>

</td></tr>
<tr><td>

[dynamicImport](#)

</td><td>

</td><td>

(path: string) =&gt; Promise&lt;any&gt;

</td><td>

</td></tr>
<tr><td>

[env](#)

</td><td>

</td><td>

[SystemEnvironment](#systemenvironment)

</td><td>

</td></tr>
<tr><td>

[getInputFiles?](#)

</td><td>

</td><td>

(rootDir: string) =&gt; Promise&lt;[TransformModuleInput](#transformmoduleinput)[]&gt;

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[os](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[path](#)

</td><td>

</td><td>

[Path](#path)

</td><td>

</td></tr>
<tr><td>

[strictDynamicImport](#)

</td><td>

</td><td>

(path: string) =&gt; Promise&lt;any&gt;

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## parse

```typescript
parse(path: string): {
        root: string;
        dir: string;
        base: string;
        ext: string;
        name: string;
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

path

</td><td>

string

</td><td>

</td></tr>
</tbody></table>
**Returns:**

{ root: string; dir: string; base: string; ext: string; name: string; }

## Path

```typescript
export interface Path
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

[delimiter](#)

</td><td>

`readonly`

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[posix](#)

</td><td>

`readonly`

</td><td>

[Path](#path)

</td><td>

</td></tr>
<tr><td>

[sep](#)

</td><td>

`readonly`

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[win32](#)

</td><td>

`readonly`

</td><td>

null

</td><td>

</td></tr>
</tbody></table>

<table><thead><tr><th>

Method

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

[basename(path, ext)](#path-basename)

</td><td>

</td></tr>
<tr><td>

[dirname(path)](#path-dirname)

</td><td>

</td></tr>
<tr><td>

[extname(path)](#path-extname)

</td><td>

</td></tr>
<tr><td>

[format(pathObject)](#path-format)

</td><td>

</td></tr>
<tr><td>

[isAbsolute(path)](#path-isabsolute)

</td><td>

</td></tr>
<tr><td>

[join(paths)](#path-join)

</td><td>

</td></tr>
<tr><td>

[normalize(path)](#path-normalize)

</td><td>

</td></tr>
<tr><td>

[parse(path)](#path-parse)

</td><td>

</td></tr>
<tr><td>

[relative(from, to)](#path-relative)

</td><td>

</td></tr>
<tr><td>

[resolve(paths)](#path-resolve)

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## preventNavigate

## UnisynthBuildMode

```typescript
export type UnisynthBuildMode = "production" | "development";
```

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/plugins/plugin.ts)

## UnisynthBuildTarget

```typescript
export type UnisynthBuildTarget = "client" | "ssr" | "lib" | "test";
```

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/plugins/plugin.ts)

## UnisynthBundle

```typescript
export interface UnisynthBundle
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

[dynamicImports?](#)

</td><td>

</td><td>

string[]

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[imports?](#)

</td><td>

</td><td>

string[]

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[isTask?](#)

</td><td>

</td><td>

boolean

</td><td>

_(Optional)_ Not precise, but an indication of whether this import may be a task

</td></tr>
<tr><td>

[origins?](#)

</td><td>

</td><td>

string[]

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[size](#)

</td><td>

</td><td>

number

</td><td>

</td></tr>
<tr><td>

[symbols?](#)

</td><td>

</td><td>

string[]

</td><td>

_(Optional)_

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## UnisynthManifest

The metadata of the build. One of its uses is storing where QRL symbols are located.

```typescript
export interface UnisynthManifest
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

[bundles](#)

</td><td>

</td><td>

{ [fileName: string]: [UnisynthBundle](#unisynthbundle); }

</td><td>

All code bundles, used to know the import graph

</td></tr>
<tr><td>

[injections?](#)

</td><td>

</td><td>

[GlobalInjections](#globalinjections)[]

</td><td>

_(Optional)_ CSS etc to inject in the document head

</td></tr>
<tr><td>

[manifestHash](#)

</td><td>

</td><td>

string

</td><td>

Content hash of the manifest, if this changes, the code changed

</td></tr>
<tr><td>

[mapping](#)

</td><td>

</td><td>

{ [symbolName: string]: string; }

</td><td>

Where QRLs are located

</td></tr>
<tr><td>

[options?](#)

</td><td>

</td><td>

{ target?: string; buildMode?: string; entryStrategy?: { [key: string]: any; }; }

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[platform?](#)

</td><td>

</td><td>

{ [name: string]: string; }

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[symbols](#)

</td><td>

</td><td>

{ [symbolName: string]: [UnisynthSymbol](#unisynthsymbol); }

</td><td>

QRL symbols

</td></tr>
<tr><td>

[version](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## unisynthRollup

```typescript
export declare function unisynthRollup(
  unisynthRollupOpts?: UnisynthRollupPluginOptions,
): any;
```

<table><thead><tr><th>

Parameter

</th><th>

Type

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

unisynthRollupOpts

</td><td>

[UnisynthRollupPluginOptions](#unisynthrolluppluginoptions)

</td><td>

_(Optional)_

</td></tr>
</tbody></table>
**Returns:**

any

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/plugins/rollup.ts)

## UnisynthRollupPluginOptions

```typescript
export interface UnisynthRollupPluginOptions
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

[buildMode?](#)

</td><td>

</td><td>

[UnisynthBuildMode](#unisynthbuildmode)

</td><td>

_(Optional)_ Build `production` or `development`.

Default `development`

</td></tr>
<tr><td>

[csr?](#)

</td><td>

</td><td>

boolean

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[debug?](#)

</td><td>

</td><td>

boolean

</td><td>

_(Optional)_ Prints verbose Unisynth plugin debug logs.

Default `false`

</td></tr>
<tr><td>

[entryStrategy?](#)

</td><td>

</td><td>

[EntryStrategy](#entrystrategy)

</td><td>

_(Optional)_ The Unisynth entry strategy to use while building for production. During development the type is always `segment`.

Default `{ type: "smart" }`)

</td></tr>
<tr><td>

[experimental?](#)

</td><td>

</td><td>

(keyof typeof [ExperimentalFeatures](#experimentalfeatures))[]

</td><td>

_(Optional)_ Experimental features. These can come and go in patch releases, and their API is not guaranteed to be stable between releases.

</td></tr>
<tr><td>

[lint?](#)

</td><td>

</td><td>

boolean

</td><td>

_(Optional)_ Run eslint on the source files for the ssr build or dev server. This can slow down startup on large projects. Defaults to `true`

</td></tr>
<tr><td>

[manifestInput?](#)

</td><td>

</td><td>

[UnisynthManifest](#unisynthmanifest)

</td><td>

_(Optional)_ The SSR build requires the manifest generated during the client build. The `manifestInput` option can be used to manually provide a manifest.

Default `undefined`

</td></tr>
<tr><td>

[manifestOutput?](#)

</td><td>

</td><td>

(manifest: [UnisynthManifest](#unisynthmanifest)) =&gt; Promise&lt;void&gt; \| void

</td><td>

_(Optional)_ The client build will create a manifest and this hook is called with the generated build data.

Default `undefined`

</td></tr>
<tr><td>

[optimizerOptions?](#)

</td><td>

</td><td>

[OptimizerOptions](#optimizeroptions)

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[rootDir?](#)

</td><td>

</td><td>

string

</td><td>

_(Optional)_ The root of the application, which is commonly the same directory as `package.json` and `rollup.config.js`.

Default `process.cwd()`

</td></tr>
<tr><td>

[srcDir?](#)

</td><td>

</td><td>

string

</td><td>

_(Optional)_ The source directory to find all the Unisynth components. Since Unisynth does not have a single input, the `srcDir` is used to recursively find Unisynth files.

Default `src`

</td></tr>
<tr><td>

[srcInputs?](#)

</td><td>

</td><td>

[TransformModuleInput](#transformmoduleinput)[] \| null

</td><td>

_(Optional)_ Alternative to `srcDir`, where `srcInputs` is able to provide the files manually. This option is useful for an environment without a file system, such as a webworker.

Default: `null`

</td></tr>
<tr><td>

[target?](#)

</td><td>

</td><td>

[UnisynthBuildTarget](#unisynthbuildtarget)

</td><td>

_(Optional)_ Target `client` or `ssr`.

Default `client`

</td></tr>
<tr><td>

[transformedModuleOutput?](#)

</td><td>

</td><td>

((transformedModules: [TransformModule](#transformmodule)[]) =&gt; Promise&lt;void&gt; \| void) \| null

</td><td>

_(Optional)_ Hook that's called after the build and provides all of the transformed modules that were used before bundling.

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/plugins/rollup.ts)

## UnisynthSymbol

```typescript
export interface UnisynthSymbol
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

[canonicalFilename](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[captures](#)

</td><td>

</td><td>

boolean

</td><td>

</td></tr>
<tr><td>

[ctxKind](#)

</td><td>

</td><td>

'function' \| 'event'

</td><td>

</td></tr>
<tr><td>

[ctxName](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[displayName](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[hash](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[loc](#)

</td><td>

</td><td>

[number, number]

</td><td>

</td></tr>
<tr><td>

[origin](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[parent](#)

</td><td>

</td><td>

string \| null

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## unisynthVite

The types for Vite/Rollup don't allow us to be too specific about the return type. The correct return type is `[UnisynthVitePlugin, VitePlugin<never>]`, and if you search the plugin by name you'll get the `UnisynthVitePlugin`.

```typescript
export declare function unisynthVite(unisynthViteOpts?: UnisynthVitePluginOptions): any;
```

<table><thead><tr><th>

Parameter

</th><th>

Type

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

unisynthViteOpts

</td><td>

[UnisynthVitePluginOptions](#unisynthvitepluginoptions)

</td><td>

_(Optional)_

</td></tr>
</tbody></table>
**Returns:**

any

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/plugins/vite.ts)

## UnisynthViteDevResponse

```typescript
export interface UnisynthViteDevResponse
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

[\_unisynthEnvData?](#)

</td><td>

</td><td>

Record&lt;string, any&gt;

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[\_unisynthRenderResolve?](#)

</td><td>

</td><td>

() =&gt; void

</td><td>

_(Optional)_

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/plugins/vite.ts)

## UnisynthVitePlugin

This is the type of the "pre" Unisynth Vite plugin. `unisynthVite` actually returns a tuple of two plugins, but after Vite flattens them, you can find the plugin by name.

```typescript
export type UnisynthVitePlugin = P<UnisynthVitePluginApi> & {
  name: "vite-plugin-unisynth";
};
```

**References:** [UnisynthVitePluginApi](#unisynthvitepluginapi)

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/plugins/vite.ts)

## UnisynthVitePluginApi

```typescript
export interface UnisynthVitePluginApi
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

[getAssetsDir](#)

</td><td>

</td><td>

() =&gt; string \| undefined

</td><td>

</td></tr>
<tr><td>

[getClientOutDir](#)

</td><td>

</td><td>

() =&gt; string \| null

</td><td>

</td></tr>
<tr><td>

[getClientPublicOutDir](#)

</td><td>

</td><td>

() =&gt; string \| null

</td><td>

</td></tr>
<tr><td>

[getInsightsManifest](#)

</td><td>

</td><td>

(clientOutDir?: string \| null) =&gt; Promise&lt;[InsightManifest](#insightmanifest) \| null&gt;

</td><td>

</td></tr>
<tr><td>

[getManifest](#)

</td><td>

</td><td>

() =&gt; [UnisynthManifest](#unisynthmanifest) \| null

</td><td>

</td></tr>
<tr><td>

[getOptimizer](#)

</td><td>

</td><td>

() =&gt; [Optimizer](#optimizer) \| null

</td><td>

</td></tr>
<tr><td>

[getOptions](#)

</td><td>

</td><td>

() =&gt; NormalizedUnisynthPluginOptions

</td><td>

</td></tr>
<tr><td>

[getRootDir](#)

</td><td>

</td><td>

() =&gt; string \| null

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/plugins/vite.ts)

## UnisynthVitePluginOptions

```typescript
export type UnisynthVitePluginOptions =
  | UnisynthVitePluginCSROptions
  | UnisynthVitePluginSSROptions;
```

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/plugins/vite.ts)

## relative

```typescript
relative(from: string, to: string): string;
```

<table><thead><tr><th>

Parameter

</th><th>

Type

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

from

</td><td>

string

</td><td>

</td></tr>
<tr><td>

to

</td><td>

string

</td><td>

</td></tr>
</tbody></table>
**Returns:**

string

## resolve

```typescript
resolve(...paths: string[]): string;
```

<table><thead><tr><th>

Parameter

</th><th>

Type

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

paths

</td><td>

string[]

</td><td>

</td></tr>
</tbody></table>
**Returns:**

string

## ResolvedManifest

```typescript
export interface ResolvedManifest
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

[manifest](#)

</td><td>

</td><td>

[UnisynthManifest](#unisynthmanifest)

</td><td>

</td></tr>
<tr><td>

[mapper](#)

</td><td>

</td><td>

[SymbolMapper](#symbolmapper)

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## SegmentAnalysis

```typescript
export interface SegmentAnalysis
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

[canonicalFilename](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[captures](#)

</td><td>

</td><td>

boolean

</td><td>

</td></tr>
<tr><td>

[ctxKind](#)

</td><td>

</td><td>

'event' \| 'function'

</td><td>

</td></tr>
<tr><td>

[ctxName](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[displayName](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[entry](#)

</td><td>

</td><td>

string \| null

</td><td>

</td></tr>
<tr><td>

[extension](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[hash](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[loc](#)

</td><td>

</td><td>

[number, number]

</td><td>

</td></tr>
<tr><td>

[name](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[origin](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[parent](#)

</td><td>

</td><td>

string \| null

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## SegmentEntryStrategy

```typescript
export interface SegmentEntryStrategy
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

[manual?](#)

</td><td>

</td><td>

Record&lt;string, string&gt;

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[type](#)

</td><td>

</td><td>

'segment'

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## SingleEntryStrategy

```typescript
export interface SingleEntryStrategy
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

[manual?](#)

</td><td>

</td><td>

Record&lt;string, string&gt;

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[type](#)

</td><td>

</td><td>

'single'

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## SmartEntryStrategy

```typescript
export interface SmartEntryStrategy
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

[manual?](#)

</td><td>

</td><td>

Record&lt;string, string&gt;

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[type](#)

</td><td>

</td><td>

'smart'

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## SourceLocation

```typescript
export interface SourceLocation
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

[endCol](#)

</td><td>

</td><td>

number

</td><td>

</td></tr>
<tr><td>

[endLine](#)

</td><td>

</td><td>

number

</td><td>

</td></tr>
<tr><td>

[hi](#)

</td><td>

</td><td>

number

</td><td>

</td></tr>
<tr><td>

[lo](#)

</td><td>

</td><td>

number

</td><td>

</td></tr>
<tr><td>

[startCol](#)

</td><td>

</td><td>

number

</td><td>

</td></tr>
<tr><td>

[startLine](#)

</td><td>

</td><td>

number

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## SourceMapsOption

```typescript
export type SourceMapsOption = "external" | "inline" | undefined | null;
```

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## symbolMapper

> This API is provided as an alpha preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.

For a given symbol (QRL such as `onKeydown$`) the server needs to know which bundle the symbol is in.

Normally this is provided by Unisynth's `q-manifest` . But `q-manifest` only exists after a full client build.

This would be a problem in dev mode. So in dev mode the symbol is mapped to the expected URL using the symbolMapper function below. For Vite the given path is fixed for a given symbol.

```typescript
symbolMapper: ReturnType<typeof createSymbolMapper>;
```

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/plugins/vite-dev-server.ts)

## SymbolMapper

> This API is provided as an alpha preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.

For a given symbol (QRL such as `onKeydown$`) the server needs to know which bundle the symbol is in.

Normally this is provided by Unisynth's `q-manifest` . But `q-manifest` only exists after a full client build.

This would be a problem in dev mode. So in dev mode the symbol is mapped to the expected URL using the symbolMapper function below. For Vite the given path is fixed for a given symbol.

```typescript
symbolMapper: ReturnType<typeof createSymbolMapper>;
```

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## SymbolMapperFn

```typescript
export type SymbolMapperFn = (
  symbolName: string,
  mapper: SymbolMapper | undefined,
  parent?: string,
) => readonly [symbol: string, chunk: string] | undefined;
```

**References:** [SymbolMapper](#symbolmapper)

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## SystemEnvironment

```typescript
export type SystemEnvironment =
  | "node"
  | "deno"
  | "bun"
  | "webworker"
  | "browsermain"
  | "unknown";
```

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## transformFs

Transforms the directory from the file system.

```typescript
transformFs(opts: TransformFsOptions): Promise<TransformOutput>;
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

[TransformFsOptions](#transformfsoptions)

</td><td>

</td></tr>
</tbody></table>
**Returns:**

Promise&lt;[TransformOutput](#transformoutput)&gt;

## TransformFsOptions

```typescript
export interface TransformFsOptions extends TransformOptions
```

**Extends:** [TransformOptions](#transformoptions)

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

[vendorRoots](#)

</td><td>

</td><td>

string[]

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## transformFsSync

Transforms the directory from the file system.

```typescript
transformFsSync(opts: TransformFsOptions): TransformOutput;
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

[TransformFsOptions](#transformfsoptions)

</td><td>

</td></tr>
</tbody></table>
**Returns:**

[TransformOutput](#transformoutput)

## TransformModule

```typescript
export interface TransformModule
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

[code](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[isEntry](#)

</td><td>

</td><td>

boolean

</td><td>

</td></tr>
<tr><td>

[map](#)

</td><td>

</td><td>

string \| null

</td><td>

</td></tr>
<tr><td>

[origPath](#)

</td><td>

</td><td>

string \| null

</td><td>

</td></tr>
<tr><td>

[path](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[segment](#)

</td><td>

</td><td>

[SegmentAnalysis](#segmentanalysis) \| null

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## TransformModuleInput

```typescript
export interface TransformModuleInput
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

[code](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[devPath?](#)

</td><td>

</td><td>

string

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[path](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## transformModules

Transforms the input code string, does not access the file system.

```typescript
transformModules(opts: TransformModulesOptions): Promise<TransformOutput>;
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

[TransformModulesOptions](#transformmodulesoptions)

</td><td>

</td></tr>
</tbody></table>
**Returns:**

Promise&lt;[TransformOutput](#transformoutput)&gt;

## TransformModulesOptions

```typescript
export interface TransformModulesOptions extends TransformOptions
```

**Extends:** [TransformOptions](#transformoptions)

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

[input](#)

</td><td>

</td><td>

[TransformModuleInput](#transformmoduleinput)[]

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## transformModulesSync

Transforms the input code string, does not access the file system.

```typescript
transformModulesSync(opts: TransformModulesOptions): TransformOutput;
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

[TransformModulesOptions](#transformmodulesoptions)

</td><td>

</td></tr>
</tbody></table>
**Returns:**

[TransformOutput](#transformoutput)

## TransformOptions

```typescript
export interface TransformOptions
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

[entryStrategy?](#)

</td><td>

</td><td>

[EntryStrategy](#entrystrategy)

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[explicitExtensions?](#)

</td><td>

</td><td>

boolean

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[isServer?](#)

</td><td>

</td><td>

boolean

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[minify?](#)

</td><td>

</td><td>

[MinifyMode](#minifymode)

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[mode?](#)

</td><td>

</td><td>

EmitMode

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[preserveFilenames?](#)

</td><td>

</td><td>

boolean

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[regCtxName?](#)

</td><td>

</td><td>

string[]

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[rootDir?](#)

</td><td>

</td><td>

string

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[scope?](#)

</td><td>

</td><td>

string

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[sourceMaps?](#)

</td><td>

</td><td>

boolean

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[srcDir](#)

</td><td>

</td><td>

string

</td><td>

</td></tr>
<tr><td>

[stripCtxName?](#)

</td><td>

</td><td>

string[]

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[stripEventHandlers?](#)

</td><td>

</td><td>

boolean

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[stripExports?](#)

</td><td>

</td><td>

string[]

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[transpileJsx?](#)

</td><td>

</td><td>

boolean

</td><td>

_(Optional)_

</td></tr>
<tr><td>

[transpileTs?](#)

</td><td>

</td><td>

boolean

</td><td>

_(Optional)_

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## TransformOutput

```typescript
export interface TransformOutput
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

[diagnostics](#)

</td><td>

</td><td>

[Diagnostic](#diagnostic)[]

</td><td>

</td></tr>
<tr><td>

[isJsx](#)

</td><td>

</td><td>

boolean

</td><td>

</td></tr>
<tr><td>

[isTypeScript](#)

</td><td>

</td><td>

boolean

</td><td>

</td></tr>
<tr><td>

[modules](#)

</td><td>

</td><td>

[TransformModule](#transformmodule)[]

</td><td>

</td></tr>
</tbody></table>

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## TranspileOption

```typescript
export type TranspileOption = boolean | undefined | null;
```

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/types.ts)

## valibot

## versions

```typescript
versions: {
  unisynth: string;
}
```

[Edit this section](https://github.com/khulnasoft/unisynth/tree/main/packages/unisynth/src/optimizer/src/versions.ts)