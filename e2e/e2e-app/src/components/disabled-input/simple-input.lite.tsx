import { useMetadata } from '@khulnasoft.com/unisynth';
export type DisabledProps = {
  testId: string;
  disabled?: boolean;
};
useMetadata({});

export default function SimpleInput(props: DisabledProps) {
  return (
    <div>
      <input data-testid={props.testId} disabled={props.disabled} />
    </div>
  );
}
