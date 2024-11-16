import {
  renderToStream,
  type RenderToStreamOptions,
} from "@khulnasoft.com/unisynth/server";
import { manifest } from "@unisynth-client-manifest";
import Root from "./root";

export default function (opts: RenderToStreamOptions) {
  return renderToStream(<Root />, {
    manifest,
    base: "/unisynthcity-test/build/",
    ...opts,
  });
}
