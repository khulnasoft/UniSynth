import { parseTemplate } from '@angular/compiler';
import { ASTWithSource } from '@angular/compiler/src/expression_parser/ast';
import { BoundText, Element, Node, Template, Text } from '@angular/compiler/src/render3/r3_ast';
import { types } from '@babel/core';
import { omit } from 'lodash';
import ts from 'typescript';
import { babelTransformCode } from '../helpers/babel-transform';
import { createSingleBinding } from '../helpers/bindings';
import { capitalize } from '../helpers/capitalize';
import { createUnisynthComponent } from '../helpers/create-unisynth-component';
import { createUnisynthNode } from '../helpers/create-unisynth-node';
import { Dictionary } from '../helpers/typescript';
import { UnisynthComponent } from '../types/unisynth-component';
import { Binding, UnisynthNode } from '../types/unisynth-node';

const getTsAST = (code: string) => {
  return ts.createSourceFile('code.ts', code, ts.ScriptTarget.Latest, true);
};

interface AngularToUnisynthOptions {}

const transformBinding = (binding: string, _options: AngularToUnisynthOptions) => {
  return babelTransformCode(binding, {
    Identifier(path) {
      const name = path.node.name;

      if (
        (types.isObjectProperty(path.parent) && path.parent.key === path.node) ||
        (types.isMemberExpression(path.parent) && path.parent.property === path.node)
      ) {
        return;
      }

      if (!(name.startsWith('state.') || name === 'event' || name === '$event')) {
        path.replaceWith(types.identifier(`state.${name}`));
      }
    },
  });
};

const isElement = (node: Node): node is Element =>
  // TODO: theres got to be a better way than this
  Array.isArray((node as any).attributes);

const isTemplate = (node: Node): node is Template =>
  // TODO: theres got to be a better way than this
  Array.isArray((node as any).templateAttrs);

const isText = (node: Node): node is Text => typeof (node as any).value === 'string';

const isBoundText = (node: Node): node is BoundText => typeof (node as any).value === 'object';

const angularTemplateNodeToUnisynthNode = (
  node: Node,
  options: AngularToUnisynthOptions,
): UnisynthNode => {
  if (isTemplate(node)) {
    const ngIf = node.templateAttrs.find((item) => item.name === 'ngIf');
    if (ngIf) {
      return createUnisynthNode({
        name: 'Show',
        bindings: {
          when: createSingleBinding({
            code: transformBinding((ngIf.value as ASTWithSource).source!, options),
          }),
        },
        children: [angularTemplateNodeToUnisynthNode(omit(node, 'templateAttrs'), options)],
      });
    }
    const ngFor = node.templateAttrs.find((item) => item.name === 'ngFor');
    if (ngFor) {
      const value = (ngFor.value as ASTWithSource).source!;
      const split = value.split(/let\s|\sof\s/);
      const [_let, itemName, _of, expression] = split;
      return createUnisynthNode({
        name: 'For',
        bindings: {
          each: createSingleBinding({ code: transformBinding(expression, options) }),
        },
        scope: {
          forName: itemName,
        },
        children: [angularTemplateNodeToUnisynthNode(omit(node, 'templateAttrs'), options)],
      });
    }
  }

  if (isElement(node)) {
    const properties: Record<string, string> = {};
    const bindings: Dictionary<Binding> = {};

    for (const input of node.inputs) {
      bindings[input.name] = createSingleBinding({
        code: transformBinding((input.value as ASTWithSource).source!, options),
      });
    }
    for (const output of node.outputs) {
      bindings['on' + capitalize(output.name)] = createSingleBinding({
        code: transformBinding(
          (output.handler as ASTWithSource)
            .source! // TODO: proper reference replace
            .replace(/\$event/g, 'event'),
          options,
        ),
      });
    }
    for (const attribute of node.attributes) {
      properties[attribute.name] = attribute.value;
    }

    return createUnisynthNode({
      name: node.name,
      properties,
      bindings: bindings,
      children: node.children.map((node) => angularTemplateNodeToUnisynthNode(node, options)),
    });
  }

  if (isText(node)) {
    return createUnisynthNode({
      properties: {
        _text: node.value,
      },
    });
  }

  if (isBoundText(node)) {
    // TODO: handle the bindings
    return createUnisynthNode({
      properties: {
        _text: (node.value as ASTWithSource).source!,
      },
    });
  }

  throw new Error(`Element node type {${node}} is not supported`);
};

const angularTemplateToUnisynthNodes = (template: string, options: AngularToUnisynthOptions) => {
  const ast = parseTemplate(template, '.');
  const blocks = ast.nodes.map((node) => angularTemplateNodeToUnisynthNode(node, options));

  return blocks;
};

const parseTypescript = (code: string, options: AngularToUnisynthOptions) => {
  const component = createUnisynthComponent();

  const ast = getTsAST(code);
  for (const statement of ast.statements) {
    if (ts.isClassDeclaration(statement)) {
      const decorators = ts.canHaveDecorators(statement) ? ts.getDecorators(statement) : undefined;
      if (decorators) {
        for (const decorator of decorators) {
          // TODO: proper reference tracing
          if (ts.isCallExpression(decorator.expression))
            if (
              ts.isIdentifier(decorator.expression.expression) &&
              decorator.expression.expression.text === 'Component'
            ) {
              const firstArg = decorator.expression.arguments[0];
              if (ts.isObjectLiteralExpression(firstArg)) {
                firstArg.properties.find((item) => {
                  if (ts.isPropertyAssignment(item)) {
                    if (ts.isIdentifier(item.name) && item.name.text === 'template') {
                      if (ts.isTemplateLiteral(item.initializer)) {
                        const template = item.initializer.getText().trim().slice(1, -1);
                        component.children = angularTemplateToUnisynthNodes(template, options);
                      }
                    }
                  }
                });
              }
            }
        }
      }
    }
  }

  return component;
};

export function angularToUnisynthComponent(
  code: string,
  options: AngularToUnisynthOptions = {},
): UnisynthComponent {
  return parseTypescript(code, options);
}
