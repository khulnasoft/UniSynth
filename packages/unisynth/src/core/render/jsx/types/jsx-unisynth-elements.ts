import type {
  IntrinsicHTMLElements,
  IntrinsicSVGElements,
  UnisynthHTMLElements,
  UnisynthSVGElements,
} from './jsx-generated';

export type { UnisynthIntrinsicAttributes } from './jsx-unisynth-attributes';

/**
 * The interface holds available attributes of both native DOM elements and custom Unisynth elements. An
 * example showing how to define a customizable wrapper component:
 *
 * ```tsx
 * import { component$, Slot, type UnisynthIntrinsicElements } from "@khulnasoft.com/unisynth";
 *
 * type WrapperProps = {
 *   attributes?: UnisynthIntrinsicElements["div"];
 * };
 *
 * export default component$<WrapperProps>(({ attributes }) => {
 *   return (
 *     <div {...attributes} class="p-2">
 *       <Slot />
 *     </div>
 *   );
 * });
 * ```
 *
 * Note: It is shorter to use `PropsOf<'div'>`
 *
 * @public
 */
export interface UnisynthIntrinsicElements extends UnisynthHTMLElements, UnisynthSVGElements {}

/**
 * These definitions are for the JSX namespace, they allow passing plain event handlers instead of
 * QRLs
 */
export interface LenientUnisynthElements extends IntrinsicHTMLElements, IntrinsicSVGElements {}
