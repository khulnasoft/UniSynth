import { component$, getLocale } from "@khulnasoft.com/unisynth";
import type { RequestHandler } from "@khulnasoft.com/unisynth-city";

export const onRequest: RequestHandler = ({ locale }) => {
  locale("test-locale");
};

export default component$(() => {
  return (
    <div>
      Current locale: <span class="locale">{getLocale()}</span>
    </div>
  );
});
