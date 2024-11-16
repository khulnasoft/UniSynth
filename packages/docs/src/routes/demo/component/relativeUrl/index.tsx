import { component$ } from '@khulnasoft.com/unisynth';
import { useLocation } from '@khulnasoft.com/unisynth-city';

export default component$(() => {
  const loc = useLocation();
  const relativeUrl = '/mock';
  const absoluteUrl = loc.url.origin + relativeUrl;

  return (
    <section>
      <div>Relative URL: {relativeUrl}</div>
      <div>Absolute URL: {absoluteUrl}</div>
    </section>
  );
});
