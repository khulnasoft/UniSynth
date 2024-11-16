import { test, assert } from 'vitest';
import { updateViteConfig } from './code-mod';
import ts from 'typescript';

const prepareOutput = (str: string) =>
  str
    .split('\n')
    .map((part) => part.trim())
    .join('\n');

test('update existing unisynth vite plugin config prop', () => {
  const sourceText = `
    export default defineConfig(() => {
      return {
        plugins: [
          unisynthVite({ssr:false}),
        ],
      };
    });
  `;
  const outputText = updateViteConfig(ts, sourceText, {
    unisynthViteConfig: { ssr: `{ outDir: 'netlify/edge-functions/entry.netlify' }` },
  })!;
  assert.include(
    outputText,
    'unisynthVite({ ssr: { outDir: "netlify/edge-functions/entry.netlify" } })'
  );
});

test('update unisynth vite plugin config', () => {
  const sourceText = `
    export default defineConfig(() => {
      return {
        plugins: [
          unisynthVite({abc:88}),
        ],
      };
    });
  `;
  const outputText = updateViteConfig(ts, sourceText, {
    unisynthViteConfig: { ssr: `{ outDir: 'netlify/edge-functions/entry.netlify' }` },
  })!;
  assert.include(
    outputText,
    'unisynthVite({ ssr: { outDir: "netlify/edge-functions/entry.netlify" }, abc: 88 })'
  );
});

test('add unisynth vite plugin config', () => {
  const sourceText = `
    export default defineConfig(() => {
      return {
        plugins: [
          unisynthVite(),
        ],
      };
    });
  `;
  const outputText = updateViteConfig(ts, sourceText, {
    unisynthViteConfig: { ssr: `{ outDir: 'netlify/edge-functions/entry.netlify' }` },
  })!;
  assert.include(
    outputText,
    'unisynthVite({ ssr: { outDir: "netlify/edge-functions/entry.netlify" } })'
  );
});

test('add unisynth vite plugin config for object based vite config', () => {
  const sourceText = `
    export default defineConfig({
      plugins: [
        unisynthVite(),
      ],
    });
  `;
  const outputText = updateViteConfig(ts, sourceText, {
    unisynthViteConfig: { ssr: `{ outDir: 'netlify/edge-functions/entry.netlify' }` },
  })!;
  assert.include(
    outputText,
    'unisynthVite({ ssr: { outDir: "netlify/edge-functions/entry.netlify" } })'
  );
});

test('add vite plugin', () => {
  const sourceText = `
    export default defineConfig(() => {
      return {
        plugins: [
          unisynthVite(),
        ],
      };
    });
  `;
  const outputText = updateViteConfig(ts, sourceText, {
    vitePlugins: [`netlifyEdge({ functionName: 'entry.netlify' })`],
  })!;
  assert.include(outputText, 'netlifyEdge({ functionName: "entry.netlify" })');
});

test('add vite plugin to object based config', () => {
  const sourceText = `
    export default defineConfig({
      plugins: [
        unisynthVite(),
      ],
    });
  `;
  const outputText = updateViteConfig(ts, sourceText, {
    vitePlugins: [`netlifyEdge({ functionName: 'entry.netlify' })`],
  })!;
  assert.include(outputText, 'netlifyEdge({ functionName: "entry.netlify" })');
});

test('should not add vite plugin if it is already defined', () => {
  const sourceText = `
  export default defineConfig(() => {
    return {
      plugins: [
        unisynthVite(),
        netlifyEdge()
      ],
    };
  });
`;
  const outputText = updateViteConfig(ts, sourceText, {
    vitePlugins: [`netlifyEdge({ functionName: 'entry.netlify' })`],
  })!;

  const expected = `export default defineConfig(() => {
        return {
          plugins: [
            unisynthVite(),
            netlifyEdge()
          ]
        };
      });
    `;
  assert.deepEqual(prepareOutput(outputText), prepareOutput(expected));
});

test('update vite config', () => {
  const sourceText = `
    export default defineConfig(() => {
      return {
        ssr: {},
        plugins: [
          unisynthVite(),
        ],
      };
    });
  `;
  const outputText = updateViteConfig(ts, sourceText, {
    viteConfig: { ssr: `{ target: 'webworker', noExternal: true }` },
  })!;
  assert.include(outputText, 'ssr: { target: "webworker", noExternal: true');
});

test('update object based vite config', () => {
  const sourceText = `
    export default defineConfig({
      ssr: {},
      plugins: [
        unisynthVite(),
      ],
    });
  `;
  const outputText = updateViteConfig(ts, sourceText, {
    viteConfig: { ssr: `{ target: 'webworker', noExternal: true }` },
  })!;
  assert.include(outputText, 'ssr: { target: "webworker", noExternal: true');
});

test('add vite config', () => {
  const sourceText = `
    export default defineConfig(() => {
      return {
        plugins: [
          unisynthVite(),
        ],
      };
    });
  `;
  const outputText = updateViteConfig(ts, sourceText, {
    viteConfig: { ssr: `{ target: 'webworker', noExternal: true }` },
  })!;
  assert.include(outputText, 'ssr: { target: "webworker", noExternal: true');
});

test('add imports to side effect default import', () => {
  const sourceText = `import a from "@khulnasoft.com/unisynth";`;
  const outputText = updateViteConfig(ts, sourceText, {
    imports: [
      { namedImports: ['b'], importPath: '@khulnasoft.com/unisynth' },
      { namedImports: ['c', 'd'], importPath: '@builder.io/sdk-react' },
    ],
  })!;
  assert.include(outputText, 'import a, { b } from "@khulnasoft.com/unisynth";');
  assert.include(outputText, 'import { c, d } from "@builder.io/sdk-react";');
});

test('do not re-add named imports', () => {
  const sourceText = `
    import { a } from "@khulnasoft.com/unisynth";
    import { b, c } from "@builder.io/sdk-react";
    `;
  const outputText = updateViteConfig(ts, sourceText, {
    imports: [
      { namedImports: ['a'], importPath: '@khulnasoft.com/unisynth' },
      { namedImports: ['b', 'c'], importPath: '@builder.io/sdk-react' },
    ],
  })!;
  assert.include(outputText, 'import { a } from "@khulnasoft.com/unisynth";');
  assert.include(outputText, 'import { b, c } from "@builder.io/sdk-react";');
});

test('add imports to side effect import', () => {
  const sourceText = `import "@khulnasoft.com/unisynth";\nconsole.log(88);`;
  const outputText = updateViteConfig(ts, sourceText, {
    imports: [{ namedImports: ['a'], importPath: '@khulnasoft.com/unisynth' }],
  })!;
  assert.include(outputText, 'import { a } from "@khulnasoft.com/unisynth"');
});

test('leave existing imports', () => {
  const sourceText = `import { a } from "@khulnasoft.com/unisynth";`;
  const outputText = updateViteConfig(ts, sourceText, {
    imports: [{ namedImports: ['b'], importPath: '@khulnasoft.com/unisynth' }],
  })!;
  assert.include(outputText, 'import { a, b } from "@khulnasoft.com/unisynth";');
});

test('renamed default import with existing named import', () => {
  const sourceText = `import a, { b } from '@builder.io/sdk-react'`;
  const outputText = updateViteConfig(ts, sourceText, {
    imports: [
      { defaultImport: 'c', importPath: '@builder.io/sdk-react' },
      { namedImports: ['d'], importPath: '@khulnasoft.com/unisynth' },
    ],
  })!;
  assert.include(outputText, 'import c, { b } from "@builder.io/sdk-react";');
  assert.include(outputText, 'import { d } from "@khulnasoft.com/unisynth";');
});

test('renamed default import', () => {
  const sourceText = `import a from '@builder.io/sdk-react'`;
  const outputText = updateViteConfig(ts, sourceText, {
    imports: [{ defaultImport: 'b', importPath: '@builder.io/sdk-react' }],
  })!;
  assert.include(outputText, 'import b from "@builder.io/sdk-react";');
});

test('add default import to empty file', () => {
  const sourceText = ``;
  const outputText = updateViteConfig(ts, sourceText, {
    imports: [{ defaultImport: 'a', importPath: '@builder.io/sdk-react' }],
  })!;
  assert.include(outputText, 'import a from "@builder.io/sdk-react";');
});

test('add named imports to empty file', () => {
  const sourceText = ``;
  const outputText = updateViteConfig(ts, sourceText, {
    imports: [{ namedImports: ['a'], importPath: '@builder.io/sdk-react' }],
  })!;
  assert.include(outputText, 'import { a } from "@builder.io/sdk-react";');
});
