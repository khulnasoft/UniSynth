import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateUnisynthApiMarkdownDocs, generateUnisynthCityApiMarkdownDocs } from './api-docs';
import { type BuildConfig, panic, copyFile, ensureDir } from './util';

/**
 * Create each submodule's bundled dts file, and ensure the public API has not changed for a
 * production build.
 */
export async function apiExtractorUnisynth(config: BuildConfig) {
  // core
  // Run the api extractor for each of the submodules
  createTypesApi(
    config,
    join(config.srcUnisynthDir, 'core'),
    join(config.distUnisynthPkgDir, 'core.d.ts'),
    '.'
  );
  writeFileSync(
    join(config.distUnisynthPkgDir, 'index.d.ts'),
    `// re-export to make TS happy when not using nodenext import resolution\nexport * from './core';`
  );
  // Special case for jsx-runtime:
  // It only re-exports JSX. Don't duplicate the types
  const jsxContent = readFileSync(join(config.srcUnisynthDir, 'jsx-runtime.ts'), 'utf-8');
  writeFileSync(
    join(config.distUnisynthPkgDir, 'jsx-runtime.d.ts'),
    `// re-export to make TS happy when not using nodenext import resolution\n${jsxContent}`
  );
  ensureDir(join(config.distUnisynthPkgDir, 'jsx-runtime'));
  writeFileSync(
    join(config.distUnisynthPkgDir, 'jsx-runtime', 'index.d.ts'),
    `// re-export to make TS happy when not using nodenext import resolution\nexport * from '../jsx-runtime';`
  );
  createTypesApi(
    config,
    join(config.srcUnisynthDir, 'optimizer'),
    join(config.distUnisynthPkgDir, 'optimizer.d.ts'),
    '.'
  );
  createTypesApi(
    config,
    join(config.srcUnisynthDir, 'server'),
    join(config.distUnisynthPkgDir, 'server.d.ts'),
    '.'
  );
  createTypesApi(
    config,
    join(config.srcUnisynthDir, 'testing'),
    join(config.distUnisynthPkgDir, 'testing', 'index.d.ts'),
    '..'
  );
  createTypesApi(
    config,
    join(config.srcUnisynthDir, 'build'),
    join(config.distUnisynthPkgDir, 'build', 'index.d.ts'),
    '..'
  );
  generateServerReferenceModules(config);

  const apiJsonInputDir = join(config.rootDir, 'dist-dev', 'api');
  await generateUnisynthApiMarkdownDocs(config, apiJsonInputDir);

  console.log('🥶', 'unisynth d.ts API files generated');
}

export async function apiExtractorUnisynthCity(config: BuildConfig) {
  // unisynth-city
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'runtime', 'src'),
    join(config.packagesDir, 'unisynth-city', 'lib', 'index.d.ts')
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'runtime', 'src', 'service-worker'),
    join(config.packagesDir, 'unisynth-city', 'lib', 'service-worker.d.ts')
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'buildtime', 'vite'),
    join(config.packagesDir, 'unisynth-city', 'lib', 'vite', 'index.d.ts')
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'adapters', 'azure-swa', 'vite'),
    join(config.packagesDir, 'unisynth-city', 'lib', 'adapters', 'azure-swa', 'vite', 'index.d.ts')
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'adapters', 'cloudflare-pages', 'vite'),
    join(
      config.packagesDir,
      'unisynth-city',
      'lib',
      'adapters',
      'cloudflare-pages',
      'vite',
      'index.d.ts'
    )
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'adapters', 'cloud-run', 'vite'),
    join(config.packagesDir, 'unisynth-city', 'lib', 'adapters', 'cloud-run', 'vite', 'index.d.ts')
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'adapters', 'deno-server', 'vite'),
    join(
      config.packagesDir,
      'unisynth-city',
      'lib',
      'adapters',
      'deno-server',
      'vite',
      'index.d.ts'
    )
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'adapters', 'bun-server', 'vite'),
    join(config.packagesDir, 'unisynth-city', 'lib', 'adapters', 'bun-server', 'vite', 'index.d.ts')
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'adapters', 'node-server', 'vite'),
    join(
      config.packagesDir,
      'unisynth-city',
      'lib',
      'adapters',
      'node-server',
      'vite',
      'index.d.ts'
    )
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'adapters', 'netlify-edge', 'vite'),
    join(
      config.packagesDir,
      'unisynth-city',
      'lib',
      'adapters',
      'netlify-edge',
      'vite',
      'index.d.ts'
    )
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'adapters', 'shared', 'vite'),
    join(config.packagesDir, 'unisynth-city', 'lib', 'adapters', 'shared', 'vite', 'index.d.ts')
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'adapters', 'static', 'vite'),
    join(config.packagesDir, 'unisynth-city', 'lib', 'adapters', 'static', 'vite', 'index.d.ts')
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'adapters', 'vercel-edge', 'vite'),
    join(
      config.packagesDir,
      'unisynth-city',
      'lib',
      'adapters',
      'vercel-edge',
      'vite',
      'index.d.ts'
    )
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'middleware', 'azure-swa'),
    join(config.packagesDir, 'unisynth-city', 'lib', 'middleware', 'azure-swa', 'index.d.ts')
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'middleware', 'aws-lambda'),
    join(config.packagesDir, 'unisynth-city', 'lib', 'middleware', 'aws-lambda', 'index.d.ts')
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'middleware', 'cloudflare-pages'),
    join(config.packagesDir, 'unisynth-city', 'lib', 'middleware', 'cloudflare-pages', 'index.d.ts')
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'middleware', 'bun'),
    join(config.packagesDir, 'unisynth-city', 'lib', 'middleware', 'bun', 'index.d.ts')
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'middleware', 'deno'),
    join(config.packagesDir, 'unisynth-city', 'lib', 'middleware', 'deno', 'index.d.ts')
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'middleware', 'netlify-edge'),
    join(config.packagesDir, 'unisynth-city', 'lib', 'middleware', 'netlify-edge', 'index.d.ts')
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'middleware', 'node'),
    join(config.packagesDir, 'unisynth-city', 'lib', 'middleware', 'node', 'index.d.ts')
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'middleware', 'request-handler'),
    join(config.packagesDir, 'unisynth-city', 'lib', 'middleware', 'request-handler', 'index.d.ts')
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'middleware', 'firebase'),
    join(config.packagesDir, 'unisynth-city', 'lib', 'middleware', 'firebase', 'index.d.ts')
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'static'),
    join(config.packagesDir, 'unisynth-city', 'lib', 'static', 'index.d.ts')
  );
  createTypesApi(
    config,
    join(config.packagesDir, 'unisynth-city', 'src', 'middleware', 'vercel-edge'),
    join(config.packagesDir, 'unisynth-city', 'lib', 'middleware', 'vercel-edge', 'index.d.ts')
  );
  generateUnisynthCityReferenceModules(config);

  const apiJsonInputDir = join(config.rootDir, 'dist-dev', 'api');
  await generateUnisynthCityApiMarkdownDocs(config, apiJsonInputDir);

  console.log('🥶', 'unisynth-city d.ts API files generated');
}

function createTypesApi(
  config: BuildConfig,
  inPath: string,
  outPath: string,
  relativePath?: string
) {
  const extractorConfigPath = join(inPath, 'api-extractor.json');
  const extractorConfig = ExtractorConfig.loadFileAndPrepare(extractorConfigPath);
  const result = Extractor.invoke(extractorConfig, {
    localBuild: !!config.dev,
    showVerboseMessages: true,
    showDiagnostics: true,
    messageCallback(msg) {
      msg.handled = true;
      if (msg.logLevel === 'verbose') {
        return;
      }
      if (msg.text.includes('Analysis will use')) {
        return;
      }
      if (msg.messageId === 'console-api-report-copied') {
        if (config.dev) {
          return;
        }
        console.error(
          `❌ API Extractor, submodule: "${inPath}"\n${extractorConfigPath} has API changes.\n`
        );
        return;
      }
      if (
        msg.messageId === 'console-compiler-version-notice' ||
        msg.messageId === 'ae-undocumented'
      ) {
        return;
      }
      console.error(`❌ API Extractor, submodule: "${inPath}"\n${extractorConfigPath}\n`, msg);
    },
  });
  if (!result.succeeded) {
    console.log(
      'API build results: API changed',
      result.apiReportChanged,
      'errors',
      result.errorCount,
      'warnings',
      result.warningCount
    );
    panic(
      `Use "pnpm api.update" to automatically update the .md files if the api changes were expected`
    );
  }
  const srcPath = result.extractorConfig.untrimmedFilePath;
  const content = fixDtsContent(config, srcPath, relativePath);
  writeFileSync(outPath, content);
}

function generateUnisynthCityReferenceModules(config: BuildConfig) {
  const srcModulesPath = join(config.packagesDir, 'unisynth-city', 'lib');

  const destModulesPath = join(srcModulesPath, 'modules.d.ts');
  copyFile(join(config.packagesDir, 'unisynth-city', 'modules.d.ts'), destModulesPath);

  // manually prepend the ts reference since api extractor removes it
  const prependReferenceDts = `/// <reference path="./modules.d.ts" />\n\n`;
  const distIndexPath = join(srcModulesPath, 'index.d.ts');
  let serverDts = readFileSync(distIndexPath, 'utf-8');
  serverDts = prependReferenceDts + serverDts;
  writeFileSync(distIndexPath, serverDts);
}

function generateServerReferenceModules(config: BuildConfig) {
  // server-modules.d.ts
  const referenceDts = `/// <reference types="./server" />
declare module '@unisynth-client-manifest' {
  const manifest: import('./optimizer').UnisynthManifest;
  export { manifest };
}
// MD
declare module '*.md' {
  const node: import('./core').FunctionComponent;
  export const frontmatter: Record<string, any>;
  export default node;
}
// MDX
declare module '*.mdx' {
  const node: import('./core').FunctionComponent;
  export const frontmatter: Record<string, any>;
  export default node;
}
// SVG ?jsx
declare module '*.svg?jsx' {
  const Cmp: import('./core').FunctionComponent<import('./core').UnisynthIntrinsicElements['svg']>
  export default Cmp;
}
// Image ?jsx
declare module '*?jsx' {
  const Cmp: import('./core').FunctionComponent<Omit<import('./core').UnisynthIntrinsicElements['img'], 'src' | 'width' | 'height' | 'srcSet'>>
  export default Cmp;
  export const width: number;
  export const height: number;
  export const srcSet: string;
}
// Image &jsx
declare module '*&jsx' {
  const Cmp: import('./core').FunctionComponent<Omit<import('./core').UnisynthIntrinsicElements['img'], 'src' | 'width' | 'height' | 'srcSet'>>
  export default Cmp;
  export const width: number;
  export const height: number;
  export const srcSet: string;
}
`;

  const destServerModulesPath = join(config.distUnisynthPkgDir, 'server-modules.d.ts');
  writeFileSync(destServerModulesPath, referenceDts);

  // manually prepend the ts reference since api extractor removes it
  const prependReferenceDts = `/// <reference path="./server-modules.d.ts" />\n\n`;
  const distServerPath = join(config.distUnisynthPkgDir, 'server.d.ts');
  let serverDts = readFileSync(distServerPath, 'utf-8');
  serverDts = prependReferenceDts + serverDts;
  writeFileSync(distServerPath, serverDts);
}

/**
 * Fix up the generated dts content, and ensure it's using a relative path to find the core.d.ts
 * file, rather than node resolving it.
 */
function fixDtsContent(config: BuildConfig, srcPath: string, relativePath?: string) {
  let dts = readFileSync(srcPath, 'utf-8');

  // ensure we're just using a relative path
  if (relativePath) {
    dts = dts.replace(/'@builder\.io\/unisynth(.*)'/g, `'${relativePath}$1'`);
  }

  // replace UNISYNTH_VERSION with the actual version number, useful for debugging
  return dts.replace(/UNISYNTH_VERSION/g, config.distVersion);
}
