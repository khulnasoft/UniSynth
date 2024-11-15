import { GetContentOptions, KhulnasoftContent } from '@builder.io/sdk';
import { useStore } from '@khulnasoft.com/unisynth';
import RenderBlock, { RenderBlockProps } from './khulnasoft-render-block.raw';

type RenderContentProps = {
  options?: GetContentOptions;
  content: KhulnasoftContent;
  renderContentProps: RenderBlockProps;
};

export default function RenderContent(props: RenderContentProps) {
  const state = useStore({
    getRenderContentProps(block, index): RenderBlockProps {
      return {
        block: block,
        index: index,
      };
    },
  });

  return <RenderBlock {...state.getRenderContentProps(props.renderContentProps.block, 0)} />;
}
