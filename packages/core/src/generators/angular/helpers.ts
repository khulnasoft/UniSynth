import { stripStateAndPropsRefs } from '@/helpers/strip-state-and-props-refs';
import { type UnisynthComponent } from '@/types/unisynth-component';

export const HELPER_FUNCTIONS = (
  isTs?: boolean,
): {
  [key: string]: string;
} => ({
  useObjectWrapper: `useObjectWrapper(...args${isTs ? ': any[]' : ''}) {
    let obj = {}
    args.forEach((arg) => {
      obj = { ...obj, ...arg };
    });
    return obj;
  }`,
  useObjectDotValues: `useObjectDotValues(obj${isTs ? ': any' : ''})${isTs ? ': any[]' : ''}) {
    return Object.values(obj);
  }`,
  useTypeOf: `useTypeOf(obj${isTs ? ': any' : ''})${isTs ? ': string' : ''}) {
    return typeof obj;
  }`,
  useJsonStringify: `useJsonStringify(...args${isTs ? ': any' : ''})${isTs ? ': string' : ''}) {
    return JSON.stringify(...args);
  }`,
  setAttributes: `setAttributes(el${isTs ? ': HTMLElement' : ''}, value${
    isTs ? ': any' : ''
  }, changes${isTs ? '?: any' : ''}) {
    if (!el) {
      return;
    }
    const target = typeof changes === 'undefined' ? value : changes;
    Object.keys(target).forEach((key) => {
      if (key.startsWith('on')) {
        if (this._listenerFns.has(key)) {
          this._listenerFns.get(key)${isTs ? '!' : ''}();
        }
        this._listenerFns.set(key, this.renderer.listen(
          el,
          key.replace('on', '').toLowerCase(),
          target[key]
        ));
      } else {
        this.renderer.setAttribute(el, key.toLowerCase(), target[key] ?? '');
      }
    });
  }`,
});

export const getAppropriateTemplateFunctionKeys = (code: string) =>
  Object.keys(HELPER_FUNCTIONS()).filter((key) => code.includes(key));

/**
 * Adds code to the `onUpdate` hook of a UnisynthComponent.
 *
 * @param {UnisynthComponent} root - The root UnisynthComponent.
 * @param {string} code - The code to be added to the `onUpdate` hook.
 */
export const addCodeToOnUpdate = (root: UnisynthComponent, code: string) => {
  root.hooks.onUpdate = root.hooks.onUpdate || [];
  root.hooks.onUpdate.push({
    code,
  });
};

/**
 * Adds code to the `onInit` hook of a UnisynthComponent.
 *
 * @param {UnisynthComponent} root - The root UnisynthComponent.
 * @param {string} code - The code to be added to the `onInit` hook.
 */
export const addCodeToOnInit = (root: UnisynthComponent, code: string) => {
  if (!root.hooks.onInit?.code) {
    root.hooks.onInit = { code: '' };
  }
  root.hooks.onInit.code += `\n${code};`;
};

/**
 * Creates a reactive state in Angular.
 * Initializes the state with `null` because we cannot access `state.` or `props.` properties before the component is initialized.
 * Adds the code (init/re-init code) to the `onInit` and `onUpdate` hooks.
 * @param root The root UnisynthComponent.
 * @param stateName The name of the reactive state.
 * @param code The code to be added to the onInit and onUpdate hooks.
 */
export const makeReactiveState = (root: UnisynthComponent, stateName: string, code: string) => {
  root.state[stateName] = { code: 'null', type: 'property' };
  addCodeToOnInit(root, code);
  addCodeToOnUpdate(root, code);
};

export const getDefaultProps = ({ defaultProps }: UnisynthComponent) => {
  if (!defaultProps) return '';
  const defalutPropsString = Object.keys(defaultProps)
    .map((prop) => {
      const value = defaultProps!.hasOwnProperty(prop) ? defaultProps![prop]?.code : 'undefined';
      return `${prop}: ${value}`;
    })
    .join(',');
  return `const defaultProps = {${defalutPropsString}};\n`;
};

/**
 * if any state "property" is trying to access state.* or props.*
 * then we need to move them to onInit where they can be accessed
 * @param json The UnisynthComponent.
 */
export const transformState = (json: UnisynthComponent) => {
  Object.entries(json.state)
    .reverse()
    .forEach(([key, value]) => {
      if (value?.type === 'property') {
        if (value.code && (value.code.includes('state.') || value.code.includes('props.'))) {
          const code = stripStateAndPropsRefs(value.code, { replaceWith: 'this' });
          json.state[key]!.code = 'null';
          if (!json.hooks.onInit?.code) {
            json.hooks.onInit = { code: '' };
          }
          json.hooks.onInit.code = `\nthis.${key} = ${code};\n${json.hooks.onInit.code}`;
        }
      }
    });
};