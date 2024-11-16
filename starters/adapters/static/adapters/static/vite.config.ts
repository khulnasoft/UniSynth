import { staticAdapter } from "@khulnasoft.com/unisynth-city/adapters/static/vite";
import { extendConfig } from "@khulnasoft.com/unisynth-city/vite";
import baseConfig from "../../vite.config";

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["@unisynth-city-plan"],
      },
    },
    plugins: [
      staticAdapter({
        origin: "https://yoursite.unisynth.dev",
      }),
    ],
  };
});
