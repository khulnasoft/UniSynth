import { server$ } from '@builder.io/qwik-city';
import type { UnisynthComponent } from '@khulnasoft.com/unisynth';

export type OutputFramework =
  | 'react'
  | 'svelte'
  | 'vue'
  | 'qwik'
  | 'angular'
  | 'unisynth'
  | 'json'
  | 'marko'
  | 'reactNative'
  | 'lit'
  | 'solid'
  | 'preact'
  | 'stencil'
  | 'alpine'
  | 'khulnasoft';
export const outputs: OutputFramework[] = [
  'react',
  'svelte',
  'vue',
  'qwik',
  'angular',
  'unisynth',
  'json',
  'marko',
  'lit',
  'solid',
  'preact',
  'stencil',
  'reactNative',
  'alpine',
  'khulnasoft',
];

export type InputSyntax = 'jsx' | 'svelte';
export const inputs: InputSyntax[] = ['jsx', 'svelte'];

export const languageByFramework: Record<OutputFramework, string> = {
  react: 'typescript',
  svelte: 'html',
  vue: 'html',
  qwik: 'typescript',
  angular: 'typescript',
  unisynth: 'typescript',
  json: 'json',
  marko: 'html',
  lit: 'typescript',
  solid: 'typescript',
  preact: 'typescript',
  stencil: 'typescript',
  reactNative: 'typescript',
  alpine: 'html',
  khulnasoft: 'json',
};

const getOutputGenerator = async ({ output }: { output: OutputFramework }) => {
  const {
    componentToSvelte,
    componentToVue,
    componentToReact,
    componentToQwik,
    componentToAngular,
    componentToUnisynth,
    componentToAlpine,
    componentToLit,
    componentToMarko,
    componentToPreact,
    componentToReactNative,
    componentToSolid,
    componentToStencil,
    componentToKhulnasoft,
  } = await import('@khulnasoft.com/unisynth');

  const options = {};

  switch (output) {
    case 'qwik':
      return componentToQwik(options);
    case 'react':
      return componentToReact(options);
    case 'angular':
      return componentToAngular(options);
    case 'svelte':
      return componentToSvelte(options);
    case 'unisynth':
      return componentToUnisynth();
    case 'alpine':
      return componentToAlpine();
    case 'lit':
      return componentToLit();
    case 'marko':
      return componentToMarko();
    case 'preact':
      return componentToPreact();
    case 'reactNative':
      return componentToReactNative();
    case 'solid':
      return componentToSolid();
    case 'stencil':
      return componentToStencil();
    case 'json':
      return ({ component }: { component: UnisynthComponent }) => JSON.stringify(component, null, 2);
    case 'vue':
      return componentToVue({ api: 'composition' });
    case 'khulnasoft':
      return ({ component }: { component: UnisynthComponent }) => {
        return JSON.stringify(componentToKhulnasoft(options)({ component }), null, 2);
      };
    default:
      throw new Error('unexpected Output ' + output);
  }
};

export const compile = server$(
  async (code: string, output: OutputFramework, inputSyntax: InputSyntax) => {
    const { parseJsx, parseSvelte } = await import('@khulnasoft.com/unisynth');
    const parsed = inputSyntax === 'svelte' ? await parseSvelte(code) : parseJsx(code);

    const outputGenerator = await getOutputGenerator({ output });

    const outputCode = outputGenerator({ component: parsed });

    return outputCode;
  },
);

export const defaultCode = `
import { useState } from "unisynth";

export default function MyComponent(props) {
  const [name, setName] = useState("Steve");

  return (
    <div>
      <input
        css={{
          color: "red",
        }}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      Hello! I can run natively in React, Vue, Svelte, Qwik, and many more frameworks!
    </div>
  );
}
`.trim();
