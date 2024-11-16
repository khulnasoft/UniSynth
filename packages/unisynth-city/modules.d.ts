declare module '@unisynth-city-plan' {
  export const routes: any[];
  export const menus: any[];
  export const trailingSlash: boolean;
  export const basePathname: string;
  export const cacheModules: boolean;
  const defaultExport: {
    routes: any[];
    menus: any[];
    trailingSlash: boolean;
    basePathname: string;
    cacheModules: boolean;
  };
  export default defaultExport;
}
declare module '@unisynth-city-not-found-paths' {
  function getNotFound(_pathname: string): string;
  export { getNotFound };
}
declare module '@unisynth-city-static-paths' {
  function isStaticPath(method: string, url: URL): boolean;
  export { isStaticPath };
}
