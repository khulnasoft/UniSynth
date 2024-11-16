import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "cypress-ct-unisynth" as any,
      bundler: "vite",
    },
  },
});
