import { component$, useErrorBoundary, Slot, type QRL } from '@khulnasoft.com/unisynth';

/** @public */
export interface ErrorBoundaryProps {
  children: any;
  fallback$: QRL<(ev: any) => any>;
}

/** @public */
export const ErrorBoundary = component$((props: ErrorBoundaryProps) => {
  const store = useErrorBoundary();

  return store.error === undefined ? <Slot /> : <>{props.fallback$(store.error)}</>;
});
