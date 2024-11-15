import {
    ContextGetInfo,
    ContextSetInfo,
    ReactivityType,
    UnisynthComponent,
} from '@/types/unisynth-component';

export const hasContext = (component: UnisynthComponent) =>
  hasSetContext(component) || hasGetContext(component);

export const hasSetContext = (component: UnisynthComponent) =>
  Object.keys(component.context.set).length > 0;

export const hasGetContext = (component: UnisynthComponent) =>
  Object.keys(component.context.get).length > 0;

export const getContextType = ({
  component,
  context,
}: {
  component: UnisynthComponent;
  context: ContextGetInfo | ContextSetInfo;
}): ReactivityType => {
  // TO-DO: remove useMetadata check if no longer needed.
  return component.meta.useMetadata?.contextTypes?.[context.name] || context.type || 'normal';
};
