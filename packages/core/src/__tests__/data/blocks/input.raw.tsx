import { Khulnasoft } from '@builder.io/sdk';
import '@khulnasoft.com/unisynth';

export interface FormInputProps {
  type?: string;
  attributes?: any;
  name?: string;
  value?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

export default function FormInputComponent(props: FormInputProps) {
  return (
    <input
      {...props.attributes}
      key={Khulnasoft.isEditing && props.defaultValue ? props.defaultValue : 'default-key'}
      placeholder={props.placeholder}
      type={props.type}
      name={props.name}
      value={props.value}
      defaultValue={props.defaultValue}
      required={props.required}
      onChange={(event) => props.onChange?.(event.target.value)}
    />
  );
}
