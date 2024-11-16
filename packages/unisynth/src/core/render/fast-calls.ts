import type { UnisynthElement } from './dom/virtual-element';

export const directSetAttribute = (el: UnisynthElement, prop: string, value: string) => {
  return el.setAttribute(prop, value);
};

export const directGetAttribute = (el: UnisynthElement, prop: string) => {
  return el.getAttribute(prop);
};

export const directRemoveAttribute = (el: UnisynthElement, prop: string) => {
  return el.removeAttribute(prop);
};
