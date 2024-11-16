import { renderToStream, RenderOptions } from "@khulnasoft.com/unisynth/server";
import { manifest } from "@unisynth-client-manifest";
import Root from "./root";

/**
 * Unisynth server-side render function.
 */
export default function (opts: RenderOptions) {
  return renderToStream(<Root />, {
    manifest,
    ...opts,
  });
}
