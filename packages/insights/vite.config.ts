import { defineConfig, loadEnv } from 'vite';
import { unisynthVite } from '@khulnasoft.com/unisynth/optimizer';
import { unisynthCity } from '@khulnasoft.com/unisynth-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { unisynthInsights, unisynthTypes } from '@khulnasoft.com/unisynth-labs/vite';
import { macroPlugin } from '@builder.io/vite-plugin-macro';

export default defineConfig(async () => {
  return {
    plugins: [
      macroPlugin({ preset: 'pandacss' }),
      unisynthCity(),
      unisynthTypes(),
      unisynthVite(),
      tsconfigPaths({ projects: ['.'] }),
      unisynthInsights({ publicApiKey: loadEnv('', '.', '').PUBLIC_UNISYNTH_INSIGHTS_KEY }),
    ],
    dev: {
      headers: {
        'Cache-Control': 'public, max-age=0',
      },
    },
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
    optimizeDeps: {
      include: ['@auth/core'],
    },
  };
});
