import { format } from 'prettier/standalone';
import { stringifyContextValue } from '../../../helpers/get-state-object-string';
import { BaseTranspilerOptions } from '../../../types/transpiler';
import { UnisynthContext } from '../../../types/unisynth-context';

export const getContextWithSymbolKey =
  (options: Pick<BaseTranspilerOptions, 'prettier'>) =>
  ({ context }: { context: UnisynthContext }): string => {
    let str = `
  const key = Symbol();  

  export default {
    ${context.name}: ${stringifyContextValue(context.value)}, 
    key 
  }
  `;

    if (options.prettier !== false) {
      try {
        str = format(str, {
          parser: 'typescript',
          plugins: [
            require('prettier/parser-typescript'), // To support running in browsers
          ],
        });
      } catch (err) {
        if (process.env.NODE_ENV !== 'test') {
          console.error('Format error for file:', str);
        }
        throw err;
      }
    }

    return str;
  };
