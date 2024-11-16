import {
  accessSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readPackageJson, writePackageJson } from './package-json';

import assert from 'assert';
import { panic } from './util';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function validateCreateUnisynthCli() {
  console.log(`👾 validating create-unisynth...`);

  const cliDir = join(__dirname, '..', 'packages', 'create-unisynth');
  accessSync(cliDir);

  const cliBin = join(cliDir, 'create-unisynth.cjs');
  accessSync(cliBin);

  const cliPkgJsonPath = join(cliDir, 'package.json');
  const cliPkgJson = JSON.parse(readFileSync(cliPkgJsonPath, 'utf-8'));
  assert.strictEqual(cliPkgJson.name, 'create-unisynth');
  const unisynthVersion = cliPkgJson.version;

  const startersDir = join(cliDir, 'dist', 'starters');
  accessSync(startersDir);

  const appsDir = join(startersDir, 'apps');
  accessSync(appsDir);

  const cliApi = join(cliDir, 'dist', 'index.cjs');
  console.log(`💫 import cli api: ${cliApi}`);
  const api: typeof import('create-unisynth') = await import(pathToFileURL(cliApi).href);

  const tmpDir = join(__dirname, '..', 'dist-dev');

  await Promise.all([
    validateStarter(api, tmpDir, 'playground', true, `👻`, unisynthVersion),
    validateStarter(api, tmpDir, 'empty', true, `🫙`, unisynthVersion),
    validateStarter(api, tmpDir, 'library', false, `📚`, unisynthVersion),
  ]).catch((e) => {
    console.error(e);
    panic(String(e));
  });

  console.log(`👽 create-unisynth validated\n`);
}

async function validateStarter(
  api: typeof import('create-unisynth'),
  distDir: string,
  starterId: string,
  app: boolean,
  emoji: string,
  unisynthVersion: string
) {
  const appDir = join(distDir, 'e2e-' + starterId);

  console.log(`${emoji} ${appDir}`);
  rmSync(appDir, { force: true, recursive: true });

  const result = await api.createApp({
    starterId,
    outDir: appDir,
  });

  assert.strictEqual(result.starterId, starterId);
  assert.strictEqual(result.outDir, appDir);

  accessSync(result.outDir);

  const appPkgJsonPath = join(result.outDir, 'package.json');
  const appPkgJson = JSON.parse(readFileSync(appPkgJsonPath, 'utf-8'));

  assertRightUnisynthDepsVersions(appPkgJson, unisynthVersion, starterId);

  // Ensure that npm will use an existing version
  appPkgJson.devDependencies['@khulnasoft.com/unisynth'] = 'latest';
  appPkgJson.devDependencies['@khulnasoft.com/unisynth-city'] = 'latest';
  appPkgJson.devDependencies['eslint-plugin-unisynth'] = 'latest';
  writeFileSync(appPkgJsonPath, JSON.stringify(appPkgJson, null, 2));

  const tsconfigPath = join(result.outDir, 'tsconfig.json');
  accessSync(tsconfigPath);

  const { execa } = await import('execa');
  console.log(`${emoji} ${starterId}: npm install`);
  await execa('npm', ['install'], { cwd: appDir, stdout: 'inherit' });

  // console.log(`${emoji} ${projectName}: copy @khulnasoft.com/unisynth distribution`);
  // const unisynthNodeModule = join(appDir, 'node_modules', '@builder.io', 'unisynth');
  // rmSync(unisynthNodeModule, { force: true, recursive: true });
  // const distUnisynth = join(__dirname, '..', 'packages', 'unisynth', 'dist');
  // cpSync(distUnisynth, unisynthNodeModule);

  // console.log(`${emoji} ${projectName}: copy eslint-plugin-unisynth distribution`);
  // const eslintNodeModule = join(appDir, 'node_modules', 'eslint-plugin-unisynth');
  // rmSync(eslintNodeModule, { force: true, recursive: true });
  // const distEslintUnisynth = join(__dirname, '..', 'packages', 'eslint-plugin-unisynth', 'dist');
  // cpSync(distEslintUnisynth, eslintNodeModule);

  // console.log(`${emoji} ${projectName}: copy @types`);
  // const typesNodeModule = join(appDir, 'node_modules', '@types');
  // const distTypesUnisynth = join(__dirname, '..', 'node_modules', '@types');
  // cpSync(distTypesUnisynth, typesNodeModule);

  // console.log(`${emoji} ${projectName}: npm run build`);
  // if (app) {
  //   await execa('node', ['./node_modules/@khulnasoft.com/unisynth/unisynth.cjs', 'build'], {
  //     cwd: appDir,
  //     stdout: 'inherit',
  //   });
  // } else {
  //   await execa('npm', ['run', 'build'], {
  //     cwd: appDir,
  //     stdout: 'inherit',
  //   });
  // }

  // accessSync(join(appDir, '.vscode'));

  // if (app) {
  //   // app
  //   accessSync(join(appDir, 'dist', 'favicon.ico'));
  //   accessSync(join(appDir, 'dist', 'q-manifest.json'));
  //   accessSync(join(appDir, 'dist', 'build'));
  // } else {
  //   // library
  //   accessSync(join(appDir, 'lib', 'types'));
  //   accessSync(join(appDir, 'lib', 'index.unisynth.mjs'));
  //   accessSync(join(appDir, 'lib', 'index.unisynth.cjs'));
  // }
  // accessSync(join(appDir, 'README.md'));
  // accessSync(join(appDir, 'tsconfig.json'));
  // accessSync(join(appDir, 'tsconfig.tsbuildinfo'));

  console.log(`${emoji} ${starterId} validated\n`);
}

function assertRightUnisynthDepsVersions(appPkgJson: any, unisynthVersion: string, starterType: string) {
  assert.strictEqual(
    appPkgJson.devDependencies['@khulnasoft.com/unisynth'].includes(unisynthVersion),
    true,
    `Unisynth version mismatch for "${starterType}" starter`
  );
  if (appPkgJson.devDependencies.hasOwnProperty('@khulnasoft.com/unisynth-city')) {
    assert.strictEqual(
      appPkgJson.devDependencies['@khulnasoft.com/unisynth-city'].includes(unisynthVersion),
      true,
      `Unisynth City version mismatch for "${starterType}" starter`
    );
  }
  if (appPkgJson.devDependencies.hasOwnProperty('eslint-plugin-unisynth')) {
    assert.strictEqual(
      appPkgJson.devDependencies['eslint-plugin-unisynth'].includes(unisynthVersion),
      true,
      `ESlint plugin version mismatch for "${starterType}" starter`
    );
  }
}

function cpSync(src: string, dest: string) {
  // cpSync() not available until Node v16.7.0
  try {
    const stats = statSync(src);
    if (stats.isDirectory()) {
      mkdirSync(dest, { recursive: true });
      readdirSync(src).forEach((childItem) => {
        const childSrc = join(src, childItem);
        const childDest = join(dest, childItem);
        cpSync(childSrc, childDest);
      });
    } else {
      copyFileSync(src, dest);
    }
  } catch (e) {}
}

async function copyLocalUnisynthDistToTestApp(appDir: string) {
  const srcUnisynthDir = join(__dirname, '..', 'packages', 'unisynth');
  const destUnisynthDir = join(appDir, 'node_modules', '@builder.io', 'unisynth');
  const srcUnisynthCityDir = join(__dirname, '..', 'packages', 'unisynth-city');
  const destUnisynthCityDir = join(appDir, 'node_modules', '@builder.io', 'unisynth-city');
  const destUnisynthBin = relative(appDir, join(destUnisynthDir, 'unisynth.cjs'));

  if (existsSync(appDir) && existsSync(srcUnisynthDir) && existsSync(srcUnisynthCityDir)) {
    console.log('\nunisynth-app local development updates:');

    rmSync(destUnisynthDir, { recursive: true, force: true });
    cpSync(srcUnisynthDir, destUnisynthDir);
    console.log(
      ` - Copied "${relative(process.cwd(), srcUnisynthDir)}" to "${relative(
        process.cwd(),
        destUnisynthDir
      )}"`
    );

    rmSync(destUnisynthCityDir, { recursive: true, force: true });
    cpSync(srcUnisynthCityDir, destUnisynthCityDir);
    console.log(
      ` - Copied "${relative(process.cwd(), srcUnisynthCityDir)}" to "${relative(
        process.cwd(),
        destUnisynthCityDir
      )}"`
    );

    const appPackageJson = await readPackageJson(appDir);
    appPackageJson.scripts!.unisynth = `node ./${destUnisynthBin}`;
    await writePackageJson(appDir, appPackageJson);
    console.log(
      ` - Updated ${relative(process.cwd(), appDir)} package.json unisynth script to "${
        appPackageJson.scripts!.unisynth
      }"`
    );

    console.log('');
  }
}

(async () => {
  try {
    if (process.argv.includes('--copy-local-unisynth-dist')) {
      const appDir = join(__dirname, '..', 'unisynth-app');
      await copyLocalUnisynthDistToTestApp(appDir);
    } else {
      await validateCreateUnisynthCli();
    }
  } catch (e) {
    console.error('❌', e);
    process.exit(1);
  }
})();
