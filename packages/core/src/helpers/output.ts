import { Target, UnisynthConfig } from '@khulnasoft.com/unisynth';
import { checkIsDefined } from './nullable';

export const checkShouldOutputTypeScript = ({
  target,
  options,
}: {
  target: Target;
  options: UnisynthConfig;
}): boolean => {
  const targetTsConfig = options.options[target]?.typescript;
  return checkIsDefined(targetTsConfig) ? targetTsConfig : false;
};
