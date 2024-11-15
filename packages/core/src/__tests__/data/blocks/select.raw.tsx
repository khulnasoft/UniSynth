import { Khulnasoft } from '@builder.io/sdk';
import { For } from '@khulnasoft.com/unisynth';

export interface FormSelectProps {
  options?: { name?: string; value: string }[];
  attributes?: any;
  name?: string;
  value?: string;
  defaultValue?: string;
}

export default function SelectComponent(props: FormSelectProps) {
  return (
    <select
      {...props.attributes}
      value={props.value}
      key={Khulnasoft.isEditing && props.defaultValue ? props.defaultValue : 'default-key'}
      defaultValue={props.defaultValue}
      name={props.name}
    >
      <For each={props.options}>
        {(option, index) => (
          <option value={option.value} data-index={index}>
            {option.name || option.value}
          </option>
        )}
      </For>
    </select>
  );
}
