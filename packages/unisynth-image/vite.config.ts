import { defineConfig } from 'vite';
import { unisynthVite } from '@khulnasoft.com/unisynth/optimizer';
import dtsPlugin from 'vite-plugin-dts';

export default defineConfig(() => {
  return {
    build: {
      target: 'es2021',
      lib: {
        entry: './src/index.ts',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.unisynth.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
      rollupOptions: {
        external: ['zod'],
      },
    },
    plugins: [unisynthVite(), dtsPlugin()],
  };
});
