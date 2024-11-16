# Continuous Build Artifacts

This repo contains build artifacts that are generated as part of the continues build pipeline.

Currently supported artifacts:

- [`@khulnasoft.com/unisynth`](https://github.com/khulnasoft/unisynth-build)
- [`@khulnasoft.com/unisynth-city`](https://github.com/khulnasoft/unisynth-city-build)
- [`@khulnasoft.com/unisynth-labs`](https://github.com/khulnasoft/unisynth-labs-build)

The build artifact is created if:

- Code is merged to `main` branch
- Code is merged to `build/*` branch

## How to use

The build artifacts are useful if you want to:

- Install an un-released change.
- Bisect which specific commit caused a regression.

## Install specific build artifact

To install a specific build artifact change you `package.json` like so (not all lines may be needed):

```json
{
  "dependencies": {
    "@khulnasoft.com/unisynth": "github:khulnasoft/unisynth-build#SHA",
    "@khulnasoft.com/unisynth-city": "github:khulnasoft/unisynth-city-build#SHA",
    "@khulnasoft.com/unisynth-labs": "github:khulnasoft/unisynth-labs-build#SHA"
  }
}
```

Where `#SHA` is one of the following:

- `#SHA` - Install a specific build SHA. You can get the SHA from:
  - [`@khulnasoft.com/unisynth`](https://github.com/khulnasoft/unisynth-build/commits/) commits
  - [`@khulnasoft.com/unisynth-city`](https://github.com/khulnasoft/unisynth-city-build/commits/) commits
  - [`@khulnasoft.com/unisynth-labs`](https://github.com/khulnasoft/unisynth-labs-build/commits/) commits
- `#build/name` (or `#main`) - Install a specific `build/*` (or `#main`) branch:
  - [`@khulnasoft.com/unisynth`](https://github.com/khulnasoft/unisynth-build/branches/) branches
  - [`@khulnasoft.com/unisynth-city`](https://github.com/khulnasoft/unisynth-city-build/branches/) branches
  - [`@khulnasoft.com/unisynth-labs`](https://github.com/khulnasoft/unisynth-labs-build/branches/) branches
    > NOTE: Package managers will treat any SHA in the lock file which is on the branch as valid, and so they will not auto upgrade to the latest. For this reason this is not recommended.

## Bisect for regression

You can bisect different commits to `main` to determine which specific change has cause the regression.

1. Install latest to get an upper mound
2. Install oldest known good to get a lower bound
3. Keep bisecting until you find a specific SHA where the code breaks.

When creating the issue please include which SHA has caused the regression.
