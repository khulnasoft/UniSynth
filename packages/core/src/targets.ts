import { componentToAlpine as alpine } from './generators/alpine';
import { componentToAngular as angular } from './generators/angular';
import {
    componentToCustomElement as customElement,
    componentToHtml as html,
    componentToCustomElement as webcomponent,
} from './generators/html';
import { componentToKhulnasoft } from './generators/khulnasoft';
import { componentToLiquid as liquid } from './generators/liquid';
import { componentToLit as lit } from './generators/lit';
import { componentToMarko as marko } from './generators/marko';
import { componentToQwik as qwik } from './generators/qwik';
import { componentToPreact as preact, componentToReact as react } from './generators/react';
import { componentToReactNative as reactNative } from './generators/react-native';
import { componentToRsc as rsc } from './generators/rsc';
import { componentToSolid as solid } from './generators/solid';
import { componentToStencil as stencil } from './generators/stencil';
import { componentToSvelte as svelte } from './generators/svelte';
import { componentToSwift as swift } from './generators/swift';
import { componentToTaro as taro } from './generators/taro';
import { componentToTemplate as template } from './generators/template';
import { componentToUnisynth as unisynth } from './generators/unisynth';
import { componentToVue as vue } from './generators/vue';

export const khulnasoft = componentToKhulnasoft;

export const targets = {
  alpine,
  angular,
  customElement,
  html,
  unisynth,
  liquid,
  react,
  reactNative,
  solid,
  svelte,
  swift,
  template,
  webcomponent,
  vue,
  stencil,
  qwik,
  marko,
  preact,
  lit,
  rsc,
  taro,
} as const;

export type Targets = keyof typeof targets;
