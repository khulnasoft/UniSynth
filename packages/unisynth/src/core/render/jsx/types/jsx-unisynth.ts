import type { DOMAttributes, JSXChildren } from './jsx-unisynth-attributes';
import type { FunctionComponent, JSXOutput } from './jsx-node';
import type { UnisynthIntrinsicAttributes, LenientUnisynthElements } from './jsx-unisynth-elements';

/** @public */
export namespace UnisynthJSX {
  export type Element = JSXOutput;
  export type ElementType = string | FunctionComponent<Record<any, any>>;

  export interface IntrinsicAttributes extends UnisynthIntrinsicAttributes {}
  export interface ElementChildrenAttribute {
    children: JSXChildren;
  }
  export interface IntrinsicElements extends LenientUnisynthElements {}
}
/** @public */
export interface UnisynthDOMAttributes extends DOMAttributes<Element> {}
