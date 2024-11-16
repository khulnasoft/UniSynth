import { component$ } from '@khulnasoft.com/unisynth';
import BuilderContentComp from '../components/builder-content';
import { Header } from '../components/header/header';
import { UNISYNTH_PUBLIC_API_KEY } from '../constants';

const MODEL = 'error';

export default component$(() => {
  return (
    <div>
      <Header />
      <BuilderContentComp apiKey={UNISYNTH_PUBLIC_API_KEY} model={MODEL} tag="div" />
    </div>
  );
});
