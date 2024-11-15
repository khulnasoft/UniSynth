export type UnisynthStyles = Omit<
  Partial<CSSStyleDeclaration>,
  | 'length'
  | 'getPropertyPriority'
  | 'getPropertyValue'
  | 'item'
  | 'removeProperty'
  | 'setProperty'
  | 'parentRule'
>;
