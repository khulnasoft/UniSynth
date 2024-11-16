import { UnisynthCityProvider, RouterOutlet } from "@khulnasoft.com/unisynth-city";
import { SomeProvider } from "./components/provider/provider";
import { RouterHead } from "./components/router-head/router-head";
import "./global.css";

export default function Root() {
  return (
    <SomeProvider>
      <UnisynthCityProvider>
        <head>
          <meta charset="utf-8" />
          <RouterHead />
        </head>
        <body>
          <RouterOutlet />
        </body>
      </UnisynthCityProvider>
    </SomeProvider>
  );
}
