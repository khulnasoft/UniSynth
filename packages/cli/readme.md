# Unisynth CLI

A CLI for Unisynth.

## Installation

```bash
npm install -g @khulnasoft.com/unisynth-cli
```

## Usage

```bash
unisynth compile --to=<format> < <input-file>
cat my-file.tsx | unisynth compile -t=<format>
unisynth compile -t=<format> <input-file>
```

Check the output from `unisynth compile --help`.

**Examples**

```bash
unisynth compile -t react component.tsx
unisynth compile -t react < component.tsx
cat component.tsx | unisynth compile -t html -
unisynth compile -t react --out-dir build -- src/**/*.tsx
```

## Options

Supported formats for `--to` are:

- `reactNative`
- `solid`
- `vue`
- `react`
- `template`
- `html`
- `customElement`
- `unisynth`
- `khulnasoft`
- `swift`
- `svelte`
- `liquid`
- `angular`

Supported formats for `--from` are:

- `unisynth`
- `khulnasoft`
- `liquid`

## Cook book

Here are some recipes for standard tasks

### Validate how Khulnasoft will transform Unisynth

```bash
cat components/postscript.lite.tsx |
  unisynth compile -t khulnasoft - |
  unisynth compile -f khulnasoft -t unisynth
```

### Run unisynth on file system change

Use a tool like [entr](https://github.com/eradman/entr) or [guard](https://github.com/guard/guard)

```
find . -name '*lite.tsx' | entr make /_
```

## Known issues

- Running `unisynth` from the root of this repository breaks due to some
  dynamic babel configuration look up
- Files that are created as the result of `--out-dir=<dir>` maintain the original
  file extension of the input file, which doesn't make any sense in the case of
  an html output.
- `--out=<file>` does not support concatenating multiple files together.
