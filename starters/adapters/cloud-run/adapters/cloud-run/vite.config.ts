import { cloudRunAdapter } from "@khulnasoft.com/unisynth-city/adapters/cloud-run/vite";
import { extendConfig } from "@khulnasoft.com/unisynth-city/vite";
import baseConfig from "../../vite.config";

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.cloud-run.tsx", "@unisynth-city-plan"],
      },
    },
    plugins: [cloudRunAdapter()],
  };
});
