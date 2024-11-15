import { Slot } from '@khulnasoft.com/unisynth';

type Props = { [key: string]: string };

export default function SlotCode(props: Props) {
  return (
    <div>
      <Slot>
        <div class="default-slot">Default content</div>
      </Slot>
    </div>
  );
}
