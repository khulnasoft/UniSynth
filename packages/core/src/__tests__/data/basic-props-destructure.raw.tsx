import { useStore } from '@khulnasoft.com/unisynth';

type Props = {
  children: any;
  type: string;
};

export default function MyBasicComponent({ children: c, type }: Props) {
  const state = useStore({
    name: 'Decadef20',
  });

  return (
    <div>
      {c} {type}
      Hello! I can run in React, Vue, Solid, or Liquid!
    </div>
  );
}
