import './global.css';
import { component$ } from '@khulnasoft.com/unisynth';
import { UnisynthCityProvider, RouterOutlet, ServiceWorkerRegister } from '@khulnasoft.com/unisynth-city';
import { Insights } from '@khulnasoft.com/unisynth-labs';
import { RouterHead } from './components/router-head/router-head';
export default component$(() => {
  return (
    <UnisynthCityProvider>
      <head>
        <meta charset="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        <Insights
          publicApiKey={import.meta.env.PUBLIC_UNISYNTH_INSIGHTS_KEY}
          postUrl="/api/v1/${publicApiKey}/post/"
        />
      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </UnisynthCityProvider>
  );
});
