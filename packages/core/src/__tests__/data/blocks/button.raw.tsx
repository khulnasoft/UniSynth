import { Show } from '@khulnasoft.com/unisynth';

export interface ButtonProps {
  attributes?: any;
  text?: string;
  link?: string;
  openLinkInNewTab?: boolean;
}

export default function Button(props: ButtonProps) {
  return (
    <div>
      <Show when={props.link}>
        <a
          {...props.attributes}
          href={props.link}
          target={props.openLinkInNewTab ? '_blank' : undefined}
        >
          {props.text}
        </a>
      </Show>
      <Show when={!props.link}>
        <button {...props.attributes} type="button">
          {props.text}
        </button>
      </Show>
    </div>
  );
}