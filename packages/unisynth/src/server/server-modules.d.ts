declare module '@unisynth-client-manifest' {
  const manifest: import('.').UnisynthManifest;
  export { manifest };
}
// MD
declare module '*.md' {
  const node: import('.').FunctionComponent;
  export const frontmatter: Record<string, any>;
  export default node;
}
// MDX
declare module '*.mdx' {
  const node: import('.').FunctionComponent;
  export const frontmatter: Record<string, any>;
  export default node;
}
// SVG ?jsx
declare module '*.svg?jsx' {
  const Cmp: import('.').FunctionComponent<import('.').UnisynthIntrinsicElements['svg']>;
  export default Cmp;
}
// Image ?jsx
declare module '*?jsx' {
  const Cmp: import('.').FunctionComponent<
    Omit<import('.').UnisynthIntrinsicElements['img'], 'src' | 'width' | 'height' | 'srcSet'>
  >;
  export default Cmp;
  export const width: number;
  export const height: number;
  export const srcSet: string;
}
// Image &jsx
declare module '*&jsx' {
  const Cmp: import('.').FunctionComponent<
    Omit<import('.').UnisynthIntrinsicElements['img'], 'src' | 'width' | 'height' | 'srcSet'>
  >;
  export default Cmp;
  export const width: number;
  export const height: number;
  export const srcSet: string;
}
