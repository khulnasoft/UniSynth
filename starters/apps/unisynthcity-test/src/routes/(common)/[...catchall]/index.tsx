import { component$ } from "@khulnasoft.com/unisynth";
import {
  type DocumentHead,
  type RequestHandler,
  useLocation,
} from "@khulnasoft.com/unisynth-city";

export default component$(() => {
  const loc = useLocation();

  return (
    <div>
      <h1>Catch All</h1>
      <p>
        <span>loc.params.catchall: </span>
        <code data-test-params="catchall">{loc.params.catchall}</code>
      </p>
      <p>
        <a href="/unisynthcity-test/">Home</a>
      </p>
    </div>
  );
});

export const head: DocumentHead = () => {
  return {
    title: "Catch All",
  };
};

export const onGet: RequestHandler = ({ url, exit: exitMiddlewares }) => {
  if (url.pathname === "/unisynthcity-test/catchall/") {
    // special case catchall
    return;
  }

  exitMiddlewares();
};
