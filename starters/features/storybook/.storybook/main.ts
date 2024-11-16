import { StorybookConfig } from "storybook-framework-unisynth";

const config: StorybookConfig = {
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: {
    name: "storybook-framework-unisynth",
  },
  core: {
    renderer: "storybook-framework-unisynth",
  },
  stories: [
    // ...rootMain.stories,
    "../src/components/**/*.stories.mdx",
    "../src/components/**/*.stories.@(js|jsx|ts|tsx)",
  ],

  viteFinal: async (config: any) => {
    return config;
  },
};

export default config;
