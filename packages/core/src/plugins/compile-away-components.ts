import { mapValues } from 'lodash';
import traverse, { TraverseContext } from 'neotraverse/legacy';
import { isUnisynthNode } from '../helpers/is-unisynth-node';
import { UnisynthComponent } from '../types/unisynth-component';
import { UnisynthNode } from '../types/unisynth-node';

export const getRenderOptions = (node: UnisynthNode) => {
  return {
    ...mapValues(node.properties, (value) => `"${value}"`),
    ...mapValues(node.bindings, (value) => `{${value}}`),
  };
};

type CompileAwayComponentsOptions = {
  components: {
    [key: string]: (node: UnisynthNode, context: TraverseContext) => UnisynthNode | void;
  };
};

/**
 * @example
 *    componentToReact(unisynthJson, {
 *      plugins: [
 *        compileAwayComponents({
 *          Image: (node) => {
 *             return jsx(`
 *               <div>
 *                 <img src="${node.properties.image}" />
 *               </div>
 *             `);
 *          }
 *        })
 *      ]
 *    })
 */
export const compileAwayComponents =
  (pluginOptions: CompileAwayComponentsOptions) => (options?: any) => ({
    json: {
      pre: (json: UnisynthComponent) => {
        traverse(json).forEach(function (item) {
          if (isUnisynthNode(item)) {
            const mapper = pluginOptions.components[item.name];
            if (mapper) {
              const result = mapper(item, this);
              if (result) {
                this.update(result);
              }
            }
          }
        });
      },
    },
  });
