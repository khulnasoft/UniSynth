import { Slot } from '@khulnasoft.com/unisynth';

type Props = { [key: string]: string };

export default function SlotCode(props: Props) {
  return (
    <div>
      <Slot name="myAwesomeSlot" />
      <Slot name="top" />
      <Slot name="left">Default left</Slot>
      <Slot>Default Child</Slot>
    </div>
  );
}
