declare module '*?jsx' {
  const Cmp: import('./packages/unisynth/').FunctionComponent<
    Omit<
      import('./packages/unisynth/').UnisynthIntrinsicElements['img'],
      'src' | 'width' | 'height' | 'srcSet'
    >
  >;
  export default Cmp;
  export const width: number;
  export const height: number;
  export const srcSet: string;
}
