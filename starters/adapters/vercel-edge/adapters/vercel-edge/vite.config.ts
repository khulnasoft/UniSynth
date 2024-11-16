import { vercelEdgeAdapter } from "@khulnasoft.com/unisynth-city/adapters/vercel-edge/vite";
import { extendConfig } from "@khulnasoft.com/unisynth-city/vite";
import baseConfig from "../../vite.config";

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.vercel-edge.tsx", "@unisynth-city-plan"],
      },
      outDir: ".vercel/output/functions/_unisynth-city.func",
    },
    plugins: [vercelEdgeAdapter()],
  };
});
