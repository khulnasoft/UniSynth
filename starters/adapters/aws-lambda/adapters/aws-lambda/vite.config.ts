import { nodeServerAdapter } from "@khulnasoft.com/unisynth-city/adapters/node-server/vite";
import { extendConfig } from "@khulnasoft.com/unisynth-city/vite";
import baseConfig from "../../vite.config";
import { builtinModules } from "module";
export default extendConfig(baseConfig, () => {
  return {
    ssr: {
      // This configuration will bundle all dependencies, except the node builtins (path, fs, etc.)
      external: builtinModules,
      noExternal: /./,
    },
    build: {
      minify: false,
      ssr: true,
      rollupOptions: {
        input: ["./src/entry_aws-lambda.tsx", "@unisynth-city-plan"],
      },
    },
    plugins: [nodeServerAdapter({ name: "aws-lambda" })],
  };
});
