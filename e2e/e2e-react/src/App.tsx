// Unisynth output for not yet include .d.ts, so ignore the types when importing.
// @ts-ignore
import { E2eApp } from '@khulnasoft.com/e2e-app/react';

function App() {
  return <E2eApp pathname={window.location.pathname} />;
}

export default App;
