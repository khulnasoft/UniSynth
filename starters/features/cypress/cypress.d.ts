/// <reference types="cypress" />

import type { mount } from "cypress-ct-unisynth";

type MountParams = Parameters<typeof mount>;
type OptionsParam = MountParams[0];

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}
