import { unisynthVite } from '@khulnasoft.com/unisynth/optimizer';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(() => {
  return {
    build: {
      minify: false,
      target: 'es2022',
      outDir: 'lib',
      lib: {
        entry: ['./src/index.ts'],
        formats: ['es'],
        fileName: (format) => `index.unisynth.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
      rollupOptions: {
        external: (id) => {
          if (
            [
              '@khulnasoft.com/unisynth',
              '@khulnasoft.com/unisynth-city',
              '@khulnasoft.com/unisynth/build',
            ].includes(id)
          ) {
            return true;
          }
          if (id.endsWith('worker.js?worker&url')) {
            return true;
          }
          return false;
        },
      },
    },
    plugins: [
      unisynthVite(),
      viteStaticCopy({
        targets: [
          {
            src: 'src/worker.js',
            dest: '.',
          },
        ],
      }),
    ],
  };
}) as any;
