import {
  renderToStream,
  RenderToStreamOptions,
} from "@khulnasoft.com/unisynth/server";
import { Root } from "./root";

/**
 * Unisynth server-side render function.
 */
export default function (opts: RenderToStreamOptions) {
  return renderToStream(<Root />, opts);
}
