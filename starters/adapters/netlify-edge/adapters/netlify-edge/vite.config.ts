import { netlifyEdgeAdapter } from "@khulnasoft.com/unisynth-city/adapters/netlify-edge/vite";
import { extendConfig } from "@khulnasoft.com/unisynth-city/vite";
import baseConfig from "../../vite.config";

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.netlify-edge.tsx", "@unisynth-city-plan"],
      },
      outDir: ".netlify/edge-functions/entry.netlify-edge",
    },
    plugins: [netlifyEdgeAdapter()],
  };
});
