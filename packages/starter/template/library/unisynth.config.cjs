/**
 * @type {import('@khulnasoft.com/unisynth').UnisynthConfig}
 */
module.exports = {
  files: 'src/**',
  targets: ['qwik', 'react', 'svelte'],
  dest: 'packages',
  commonOptions: {
    typescript: true,
  },
  options: {
    react: {
      stylesType: 'style-tag',
    },
    svelte: {},
    qwik: {},
  },
};
