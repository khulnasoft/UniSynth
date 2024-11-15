type Transpiler = import('@khulnasoft.com/unisynth').Transpiler<string>;

export const generateCode = async ({
  output,
  options,
}: {
  output: string;
  options: any;
}): Promise<Transpiler> => {
  const unisynthCore = await import('@khulnasoft.com/unisynth');

  const {
    compileAwayKhulnasoftComponents,
    mapStyles,
    componentToLiquid,
    componentToAlpine,
    componentToHtml,
    componentToCustomElement,
    componentToPreact,
    componentToLit,
    componentToRsc,
    componentToQwik,
    componentToReact,
    componentToStencil,
    componentToMarko,
    componentToSwift,
    componentToReactNative,
    componentToTemplate,
    componentToSolid,
    componentToAngular,
    componentToSvelte,
    componentToUnisynth,
    componentToKhulnasoft,
    componentToVue,
  } = unisynthCore;

  const plugins = [
    compileAwayKhulnasoftComponents(),
    mapStyles({
      map: (styles) => ({
        ...styles,
        boxSizing: undefined,
        flexShrink: undefined,
        alignItems: styles.alignItems === 'stretch' ? undefined : styles.alignItems,
      }),
    }),
  ];
  const allOptions = { plugins, ...options };
  switch (output) {
    case 'liquid':
      return componentToLiquid(allOptions);
    case 'alpine':
      return componentToAlpine(allOptions);
    case 'html':
      return componentToHtml(allOptions);
    case 'webcomponents':
      return componentToCustomElement(allOptions);
    case 'preact':
      return componentToPreact(allOptions);
    case 'lit':
      return componentToLit(allOptions);
    case 'rsc':
      return componentToRsc(allOptions);
    case 'qwik':
      return componentToQwik(allOptions);
    case 'react':
      return componentToReact(allOptions);
    case 'stencil':
      return componentToStencil(allOptions);
    case 'marko':
      return componentToMarko(allOptions);
    case 'swift':
      return componentToSwift();
    case 'reactNative':
      return componentToReactNative(allOptions);
    case 'template':
      return componentToTemplate(allOptions);
    case 'solid':
      return componentToSolid(allOptions);
    case 'angular':
      return componentToAngular(allOptions);
    case 'svelte':
      return componentToSvelte(allOptions);
    case 'unisynth':
      return componentToUnisynth();
    case 'json':
      return ({ component }) => JSON.stringify(component, null, 2);
    case 'khulnasoft':
      return (args) => JSON.stringify(componentToKhulnasoft()(args), null, 2);
    case 'vue':
      return componentToVue(allOptions);
    default:
      throw new Error('unexpected Output ' + output);
  }
};
