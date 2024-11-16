import { unisynthVite } from '@khulnasoft.com/unisynth/optimizer';
import { defineConfig } from 'vite';
import pkg from './package.json';

export default defineConfig((config) => {
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
          '@supabase/supabase-js',
          '@supabase/auth-helpers-shared',
        ],
      },
    },
    define: {
      PACKAGE_NAME: JSON.stringify(pkg.name),
      PACKAGE_VERSION: JSON.stringify(pkg.version),
    },
    plugins: [unisynthVite()],
  };
}) as any;
