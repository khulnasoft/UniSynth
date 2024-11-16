import { component$ } from "@khulnasoft.com/unisynth";
import {
  UnisynthCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@khulnasoft.com/unisynth-city";
import { RouterHead } from "./components/router-head/router-head";
import { isDev } from "@khulnasoft.com/unisynth/build";

import "./global.css";

export default component$(() => {
  /**
   * The root of a UnisynthCity site always start with the <UnisynthCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <UnisynthCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
        {!isDev && <ServiceWorkerRegister />}
      </body>
    </UnisynthCityProvider>
  );
});
