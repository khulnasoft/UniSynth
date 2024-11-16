import { jsx } from '@khulnasoft.com/unisynth';
import swRegister from '@unisynth-city-sw-register';

/** @public */
export const ServiceWorkerRegister = (props: { nonce?: string }) =>
  jsx('script', { dangerouslySetInnerHTML: swRegister, nonce: props.nonce });
