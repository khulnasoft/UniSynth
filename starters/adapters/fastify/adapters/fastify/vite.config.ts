import { nodeServerAdapter } from "@khulnasoft.com/unisynth-city/adapters/node-server/vite";
import { extendConfig } from "@khulnasoft.com/unisynth-city/vite";
import baseConfig from "../../vite.config";

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.fastify.tsx", "@unisynth-city-plan"],
      },
    },
    plugins: [nodeServerAdapter({ name: "fastify" })],
  };
});
