import { link, mkdir, readdir, stat, rm } from 'fs/promises';
import { join, dirname, resolve } from 'path';

console.log('');
console.log('CREATING LOCALE PACKAGES');
const __dirname = dirname(new URL(import.meta.url).pathname);
const workspace = resolve(join(__dirname, '..'));
console.log('WORKSPACE', workspace);
const node_modules = join(workspace, 'node_modules');
const dstUnisynth = join(node_modules, '@builder.io', 'unisynth');
const dstUnisynthCity = join(node_modules, '@builder.io', 'unisynth-city');
const srcUnisynth = join(workspace, 'packages', 'unisynth', 'dist');
const srcUnisynthCity = join(workspace, 'packages', 'unisynth-city', 'lib');
main();

async function main() {
  await mkdir(join(node_modules, '@builder.io'), { recursive: true });
  linkDirFiles(srcUnisynth, dstUnisynth);
  linkDirFiles(srcUnisynthCity, dstUnisynthCity);
}

async function linkDirFiles(src: string, dst: string) {
  try {
    await rm(dst, { recursive: true });
  } catch (e) {}
  await mkdir(dst, { recursive: true });
  const files = await readdir(src);
  for (const file of files) {
    const fileStat = await stat(join(src, file));
    if (fileStat.isDirectory()) {
      linkDirFiles(join(src, file), join(dst, file));
    } else {
      console.log('LINKING', join(src, file), '=>', join(dst, file));
      await link(join(src, file), join(dst, file));
    }
  }
}
