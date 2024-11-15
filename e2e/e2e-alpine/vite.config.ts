import { resolve } from 'path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

const dir = resolve(__dirname, 'node_modules', '@khulnasoft.com', 'e2e-app', 'output', 'alpine', 'src');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    handlebars({
      partialDirectory: dir,
    }),
  ],
});
