import { bgMagenta, bold, cyan, magenta } from 'kleur/colors';

import type { CreateAppResult } from '../../../unisynth/src/cli/types';
import { logSuccessFooter } from '../../../unisynth/src/cli/utils/log';
import { note } from '../../../unisynth/src/cli/utils/utils';
import { outro } from '@clack/prompts';
import { relative } from 'node:path';

export function logAppCreated(pkgManager: string, result: CreateAppResult, ranInstall: boolean) {
  const isCwdDir = process.cwd() === result.outDir;
  const relativeProjectPath = relative(process.cwd(), result.outDir);
  const outString = [];

  if (isCwdDir) {
    outString.push(`🦄 ${bgMagenta(' Success! ')}`);
  } else {
    outString.push(
      `🦄 ${bgMagenta(' Success! ')} ${cyan(`Project created in`)} ${bold(
        magenta(relativeProjectPath)
      )} ${cyan(`directory`)}`
    );
  }
  outString.push(``);

  const unisynthAdd = pkgManager !== 'npm' ? `${pkgManager} unisynth add` : `npm run unisynth add`;
  outString.push(`🤍 ${cyan('Integrations? Add Netlify, Cloudflare, Tailwind...')}`);
  outString.push(`   ${unisynthAdd}`);
  outString.push(``);

  outString.push(logSuccessFooter(result.docs));

  outString.push(`👀 ${cyan('Presentations, Podcasts and Videos:')}`);
  outString.push(`   https://unisynth.dev/media/`);
  outString.push(``);

  outString.push(`🐰 ${cyan(`Next steps:`)}`);
  if (!isCwdDir) {
    outString.push(`   cd ${relativeProjectPath}`);
  }
  if (!ranInstall) {
    outString.push(`   ${pkgManager} install`);
  }
  outString.push(`   ${pkgManager} start`);
  outString.push(``);

  note(outString.join('\n'), 'Result');

  outro('Happy coding! 🎉');
}
