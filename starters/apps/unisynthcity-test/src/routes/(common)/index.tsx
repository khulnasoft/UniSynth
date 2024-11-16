import { component$ } from "@khulnasoft.com/unisynth";
import type { DocumentHead } from "@khulnasoft.com/unisynth-city";
// @ts-ignore
import ImageJpeg from "../../media/MyTest.jpeg?jsx";
// @ts-ignore
import ImageSvg from "../../media/unisynthLogo.svg?jsx";
// @ts-ignore
import ImageJpegResized from "../../media/MyTest.jpeg?jsx&w=100&h=100&format=avif";

export default component$(() => {
  return (
    <div>
      <h1 onClick$={() => console.warn("hola")}>Welcome to Unisynth City</h1>
      <p>The meta-framework for Unisynth.</p>
      <ImageJpeg id="image-jpeg" loading="eager" decoding="auto" />
      <ImageSvg id="image-svg" />
      <ImageJpegResized id="image-avif" />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Unisynth City",
};
