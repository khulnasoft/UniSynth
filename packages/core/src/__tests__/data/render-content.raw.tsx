import KhulnasoftContext from '@dummy/context.lite';
import {
    dispatchNewContentToVisualEditor,
    sendComponentsToVisualEditor,
    trackClick,
} from '@dummy/injection-js';
import RenderBlocks from '@dummy/RenderBlocks.lite.tsx';
import { onMount, onUpdate, setContext } from '@khulnasoft.com/unisynth';

type Props = {
  customComponents: string[];
  content: { blocks: any[]; id: string };
};

export default function RenderContent(props: Props) {
  onMount(() => {
    sendComponentsToVisualEditor(props.customComponents);
  });

  onUpdate(() => {
    dispatchNewContentToVisualEditor(props.content);
  }, [props.content]);

  setContext(KhulnasoftContext, {
    get content() {
      return 3;
    },
    get registeredComponents() {
      return 4;
    },
  });

  return (
    <div
      css={{ display: 'flex', flexDirection: 'columns' }}
      onClick={() => trackClick(props.content.id)}
    >
      <RenderBlocks blocks={props.content.blocks} />
    </div>
  );
}
