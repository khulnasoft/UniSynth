import { defineConfig } from 'vite';
import { unisynthVite } from '@khulnasoft.com/unisynth/optimizer';

export default defineConfig(() => {
  return {
    build: {
      target: 'es2020',
      outDir: '../../lib',
      lib: {
        entry: './src/index.ts',
        formats: ['es', 'cjs'] as const,
        fileName: (format) => `index.unisynth.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
      minify: false,
      rollupOptions: {
        external: ['zod', '@unisynth-city-sw-register', '@unisynth-city-plan'],
      },
    },
    plugins: [unisynthVite()],
    clearScreen: false,
    optimizeDeps: {
      force: true,
    },
  };
});
