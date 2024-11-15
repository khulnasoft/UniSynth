import { useStore } from '@khulnasoft.com/unisynth';

type Props = {
  children: any;
  type: string;
};

export default function MyBasicComponent(props: Props) {
  const state = useStore({
    name: 'Decadef20',
  });

  return (
    <div>
      {props.children} {props.type}
      Hello! I can run in React, Vue, Solid, or Liquid!
    </div>
  );
}
