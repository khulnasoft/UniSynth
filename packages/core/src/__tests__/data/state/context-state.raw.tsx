import KhulnasoftContext from '@dummy/context.lite';
import { setContext } from '@khulnasoft.com/unisynth';

export default function RenderContent(props) {
  setContext(KhulnasoftContext, {
    content: props.content,
    registeredComponents: props.customComponents,
  });

  return <div>setting context</div>;
}
