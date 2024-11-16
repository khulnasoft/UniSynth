/* eslint-disable no-console */
import { runCreateCli } from './src/run-create-cli';
import { runCreateInteractiveCli } from './src/run-create-interactive-cli';
import { panic, printHeader } from '../unisynth/src/cli/utils/utils';
import { red, yellow } from 'kleur/colors';
import { createAppFacade } from './src/create-app-facade';

export async function runCli() {
  printHeader();

  checkNodeVersion();

  try {
    const args = process.argv.slice(2);

    if (args.length > 0) {
      await runCreateCli(...args);
    } else {
      // npm create unisynth
      await runCreateInteractiveCli();
    }
  } catch (e: any) {
    panic(e.message || e);
  }
}

function checkNodeVersion() {
  const version = process.version;
  const [majorVersion, minorVersion] = version.replace('v', '').split('.');
  if (Number(majorVersion) < 16) {
    console.error(
      red(`Unisynth requires Node.js 16.8 or higher. You are currently running Node.js ${version}.`)
    );
    process.exit(1);
  } else if (Number(majorVersion) === 16) {
    if (Number(minorVersion) < 8) {
      console.warn(
        yellow(
          `Node.js 16.8 or higher is recommended. You are currently running Node.js ${version}.`
        )
      );
    }
  } else if (Number(majorVersion) === 18) {
    if (Number(minorVersion) < 11) {
      console.error(
        red(
          `Node.js 18.11 or higher is REQUIRED. From Node 18.0.0 to 18.11.0, there is a bug preventing correct behaviour of Unisynth. You are currently running Node.js ${version}. https://github.com/khulnasoft/unisynth/issues/3035`
        )
      );
    }
  }
}

export { createAppFacade as createApp, runCreateCli, runCreateInteractiveCli };
