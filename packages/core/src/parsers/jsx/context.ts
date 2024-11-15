import * as babel from '@babel/core';
import traverse from 'neotraverse/legacy';
import { createUnisynthNode } from '../../helpers/create-unisynth-node';
import { isUnisynthNode } from '../../helpers/is-unisynth-node';
import { traceReferenceToModulePath } from '../../helpers/trace-reference-to-module-path';
import { UnisynthComponent } from '../../types/unisynth-component';
import { parseStateObjectToUnisynthState } from './state';

const expressionToNode = (str: string) => {
  const code = `export default ${str}`;
  return (
    (babel.parse(code) as babel.types.File).program.body[0] as babel.types.ExportDefaultDeclaration
  ).declaration;
};

/**
 * Convert <Context.Provider /> to hooks formats by mutating the
 * UnisynthComponent tree
 */
export function extractContextComponents(json: UnisynthComponent) {
  traverse(json).forEach(function (item) {
    if (isUnisynthNode(item)) {
      if (item.name.endsWith('.Provider')) {
        const value = item.bindings?.value?.code;
        const name = item.name.split('.')[0];
        const refPath = traceReferenceToModulePath(json.imports, name)!;
        json.context.set[refPath] = {
          name,
          value: value
            ? parseStateObjectToUnisynthState(
                expressionToNode(value) as babel.types.ObjectExpression,
              )
            : undefined,
        };

        this.update(
          createUnisynthNode({
            name: 'Fragment',
            children: item.children,
          }),
        );
      }
      // TODO: maybe support Context.Consumer:
      // if (item.name.endsWith('.Consumer')) { ... }
    }
  });
}
