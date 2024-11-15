# E2E test harness for React

"Yarn workspaces" uses its understanding of the build graph in a limited way, so
to recompile and run just this set of E2E tests, you can run these commands at
the project root:

```bash
yarn workspace @khulnasoft.com/e2e-app run build
yarn workspace @khulnasoft.com/e2e-react run build
yarn workspace @khulnasoft.com/e2e-react run e2e
```
