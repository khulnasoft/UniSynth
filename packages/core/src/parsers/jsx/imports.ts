import * as babel from '@babel/core';
import { mapImportDeclarationToUnisynthImport } from '../../helpers/unisynth-imports';
import { Context, ParseUnisynthOptions } from './types';

const { types } = babel;

export const handleImportDeclaration = ({
  options,
  path,
  context,
}: {
  options: Partial<ParseUnisynthOptions>;
  path: babel.NodePath<babel.types.ImportDeclaration>;
  context: Context;
}) => {
  // @khulnasoft.com/unisynth or React imports compile away
  const customPackages = options?.compileAwayPackages || [];
  if (
    ['react', '@khulnasoft.com/unisynth', '@emotion/react', ...customPackages].includes(
      path.node.source.value,
    )
  ) {
    path.remove();
    return;
  }
  const importObject = mapImportDeclarationToUnisynthImport(path.node);
  context.khulnasoft.component.imports.push(importObject);

  path.remove();
};
