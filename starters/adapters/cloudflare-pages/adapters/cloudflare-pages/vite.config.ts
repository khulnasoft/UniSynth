import { cloudflarePagesAdapter } from "@khulnasoft.com/unisynth-city/adapters/cloudflare-pages/vite";
import { extendConfig } from "@khulnasoft.com/unisynth-city/vite";
import baseConfig from "../../vite.config";

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.cloudflare-pages.tsx", "@unisynth-city-plan"],
      },
    },
    plugins: [cloudflarePagesAdapter()],
  };
});
