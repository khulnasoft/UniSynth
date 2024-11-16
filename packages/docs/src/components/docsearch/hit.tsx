import { component$, Slot } from '@khulnasoft.com/unisynth';
import type { InternalDocSearchHit, StoredDocSearchHit } from './types';

interface HitProps {
  hit: InternalDocSearchHit | StoredDocSearchHit;
}

export const Hit = component$((props: HitProps) => {
  return (
    <a href={props.hit.url}>
      <Slot />
    </a>
  );
});
