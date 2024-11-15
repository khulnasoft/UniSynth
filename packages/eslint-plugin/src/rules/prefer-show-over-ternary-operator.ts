import * as types from '@babel/types';
import { Rule } from 'eslint';
import isUnisynthPath from '../helpers/isUnisynthPath';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '<Show> is preferred over ternary expressions',
      recommended: true,
    },
  },

  create(context) {
    // variables should be defined here
    const filename = context.getFilename();

    if (!isUnisynthPath(filename)) return {};

    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------
    //
    const listener: Rule.RuleListener = {
      ConditionalExpression(node) {
        if (types.isJSXAttribute(node.parent.parent) && types.isJSXExpressionContainer(node.parent))
          return;
        if (types.isExpressionStatement(node.parent)) return;

        context.report({
          node,
          message:
            'Ternary expression support is minimal. Please use the Unisynth `<Show>` component instead.',
        });
      },
    };
    return listener;
  },
};

export default rule;
