import { cyan, magenta, gray, dim } from 'kleur/colors';
import { loadTemplates } from '../utils/templates';
import { pmRunCmd, note } from '../utils/utils';

export async function printNewHelp() {
  const pmRun = pmRunCmd();
  const templates = await loadTemplates();

  const outString = [];
  outString.push(`${cyan('Interactive')}`);
  outString.push(`  ${pmRun} unisynth ${magenta(`new`)}`);

  outString.push(``);
  outString.push(`${cyan('New route')}`);
  outString.push(
    `  ${pmRun} unisynth ${magenta(`new /about`)}: ${dim('Create a new route for /about')}`
  );

  outString.push(``);
  outString.push(`${cyan('New component')}`);
  outString.push(
    `  ${pmRun} unisynth ${magenta(`new my-button`)}: ${dim(
      'Create a new component in src/components/my-button'
    )}`
  );
  outString.push(
    `  ${pmRun} unisynth ${magenta(`new nested/my-button`)}: ${dim(
      'Create a new component in src/components/nested/my-button'
    )}`
  );

  outString.push(``);
  outString.push(`${cyan('Available templates')}`);
  for (const t of templates) {
    let postfix = '';
    if (t.id === 'unisynth') {
      postfix = ' (default)';
    }

    outString.push(`  ${t.id}${gray(postfix)}`);
  }

  note(outString.join('\n'), 'Available commands');
}
