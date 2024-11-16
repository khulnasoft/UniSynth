import { ElementFixture, trigger } from './element-fixture';
import { setTestPlatform } from './platform';
import type { JSXOutput } from '@khulnasoft.com/unisynth';

/**
 * CreatePlatform and CreateDocument
 *
 * @public
 */
export const createDOM = async function ({ html }: { html?: string } = {}) {
  const unisynth = await getUnisynth();
  setTestPlatform(unisynth.setPlatform);
  const host = new ElementFixture({ html }).host;
  return {
    render: function (jsxElement: JSXOutput) {
      return unisynth.render(host, jsxElement);
    },
    screen: host,
    userEvent: async function (
      queryOrElement: string | Element | keyof HTMLElementTagNameMap | null,
      eventNameCamel: string | keyof WindowEventMap,
      eventPayload: any = {}
    ) {
      return trigger(host, queryOrElement, eventNameCamel, eventPayload);
    },
  };
};

const getUnisynth = async (): Promise<typeof import('@khulnasoft.com/unisynth')> => {
  if ((globalThis as any).RUNNER !== false) {
    return await import('../core/index');
  } else {
    return await import('@khulnasoft.com/unisynth');
  }
};
