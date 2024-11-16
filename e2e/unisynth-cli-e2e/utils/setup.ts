import { execSync } from 'child_process';
import { join } from 'path';
import { workspaceRoot } from '.';
import { existsSync, writeFileSync } from 'fs';

const packageCfg = {
  '@khulnasoft.com/unisynth': {
    packagePath: 'packages/unisynth',
    distPath: 'packages/unisynth/dist',
  },
  '@khulnasoft.com/unisynth-city': {
    packagePath: 'packages/unisynth-city',
    distPath: 'packages/unisynth-city/lib',
  },
  'eslint-plugin-unisynth': {
    packagePath: 'packages/eslint-plugin-unisynth',
    distPath: 'packages/eslint-plugin-unisynth/dist',
  },
};
function ensurePackageBuilt() {
  for (const [name, cfg] of Object.entries(packageCfg)) {
    if (!existsSync(join(workspaceRoot, cfg.distPath))) {
      throw new Error(`Looks like package "${name}" has not been built yet.`);
    }
  }
}
function packPackages() {
  const tarballPaths: { name: string; absolutePath: string }[] = [];
  const tarballOutDir = join(workspaceRoot, 'temp', 'tarballs');
  for (const [name, cfg] of Object.entries(packageCfg)) {
    const out = execSync(`pnpm pack --pack-destination=${tarballOutDir}`, {
      cwd: join(workspaceRoot, cfg.packagePath),
      encoding: 'utf-8',
    });
    tarballPaths.push({ name, absolutePath: out.replace(/(\r\n|\n|\r)/gm, '') });
  }
  writeFileSync(join(tarballOutDir, 'paths.json'), JSON.stringify(tarballPaths));
}

ensurePackageBuilt();
packPackages();
