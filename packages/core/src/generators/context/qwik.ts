import { UnisynthContext } from '@/types/unisynth-context';
import { format } from 'prettier/standalone';

type ContextToQwikOptions = {
  format?: boolean;
};

export const contextToQwik =
  (options: ContextToQwikOptions = {}) =>
  ({ context }: { context: UnisynthContext }): string => {
    let str = `
  import { createContextId } from '@builder.io/qwik';

  export default createContextId<any>("${context.name}")
  `;

    if (options.format !== false) {
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
