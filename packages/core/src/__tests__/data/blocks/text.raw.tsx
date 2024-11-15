import { Khulnasoft } from '@builder.io/sdk';
import { useStore } from '@khulnasoft.com/unisynth';

export interface TextProps {
  attributes?: any;
  rtlMode: boolean;
  text?: string;
  content?: string;
  khulnasoftBlock?: any;
}

export default function Text(props: TextProps) {
  const allowEditingText: boolean =
    Khulnasoft.isBrowser &&
    Khulnasoft.isEditing &&
    location.search.includes('khulnasoft.allowTextEdit=true') &&
    !(
      props.khulnasoftBlock?.bindings?.['component.options.text'] ||
      props.khulnasoftBlock?.bindings?.['options.text'] ||
      props.khulnasoftBlock?.bindings?.['text']
    );
  const state = useStore({ name: 'Decadef20' });

  // TODO: Add back dynamic `direction` CSS prop when we add support for some
  //       sort of dynamic CSS
  // css={{ direction: props.rtlMode ? 'rtl' : 'ltr' }}
  return (
    <div
      contentEditable={allowEditingText || undefined}
      data-name={{ test: state.name || 'any name' }}
      innerHTML={props.text || props.content || state.name || '<p class="text-lg">my name</p>'}
    />
  );
}
