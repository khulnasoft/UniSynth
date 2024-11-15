import { UnisynthComponent } from './unisynth-component';

export type Plugin = (options?: any) => {
  json?: {
    // Happens before any modifiers
    pre?: (json: UnisynthComponent) => UnisynthComponent | void;
    // Happens after built in modifiers
    post?: (json: UnisynthComponent) => UnisynthComponent | void;
  };
  code?: {
    // Happens before formatting
    pre?: (code: string, json: UnisynthComponent) => string;
    // Happens after formatting
    post?: (code: string, json: UnisynthComponent) => string;
  };
};
