import { unisynthVite } from '@khulnasoft.com/unisynth/optimizer';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    build: {
      minify: false,
      target: 'es2020',
      outDir: 'lib',
      lib: {
        entry: ['./src/index.ts'],
        formats: ['es', 'cjs'],
        fileName: (format) => `index.unisynth.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
      rollupOptions: {
        external: [
          '@khulnasoft.com/unisynth',
          '@khulnasoft.com/unisynth-city',
          '@khulnasoft.com/unisynth/build',
          '@auth/core',
        ],
      },
    },
    plugins: [unisynthVite()],
  };
}) as any;
