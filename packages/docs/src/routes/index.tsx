import { component$ } from '@khulnasoft.com/unisynth';
import { type DocumentHead } from '@khulnasoft.com/unisynth-city';
import BuilderContentComp from '../components/builder-content';
import { Footer } from '../components/footer/footer';
import { Header } from '../components/header/header';
import { UNISYNTH_MODEL, UNISYNTH_PUBLIC_API_KEY } from '../constants';

export default component$(() => {
  return (
    <>
      <Header />
      <main>
        <BuilderContentComp apiKey={UNISYNTH_PUBLIC_API_KEY} model={UNISYNTH_MODEL} tag="main" />
      </main>
      <div class="px-4">
        <Footer />
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Framework reimagined for the edge!',
};
