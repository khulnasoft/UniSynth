import { parseChildren } from '../helpers/children';
import { createUnisynthNode } from '../helpers/unisynth-node';

import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import { createSingleBinding } from '../../../helpers/bindings';
import { UnisynthNode } from '../../../types/unisynth-node';
import type { SveltosisComponent } from '../types';

export function parseEach(json: SveltosisComponent, node: TemplateNode): UnisynthNode {
  return {
    ...createUnisynthNode(),
    name: 'For',
    scope: { forName: node.context.name },
    bindings: {
      each: createSingleBinding({
        code: node.expression.name,
      }),
    },
    children: parseChildren(json, node),
  };
}
