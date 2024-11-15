import {
    ParseUnisynthOptions,
    Target,
    TranspilerGenerator,
    UnisynthComponent,
    UnisynthConfig,
    checkIsSvelteComponentFilePath,
    checkIsUnisynthComponentFilePath,
    checkShouldOutputTypeScript,
    createTypescriptProject,
    mapSignalTypeInTSFile,
    parseJsx,
    parseSvelte,
    removeUnisynthImport,
    renameComponentFile,
    targets,
} from '@khulnasoft.com/unisynth';
import debug from 'debug';
import { flow, pipe } from 'fp-ts/lib/function';
import { outputFile, pathExists, pathExistsSync, readFile, remove } from 'fs-extra';
import { kebabCase } from 'lodash';
import { fastClone } from '../helpers/fast-clone';
import { generateContextFile } from './helpers/context';
import { getFiles } from './helpers/files';
import { getOverrideFile } from './helpers/overrides';
import { transformImports, transpile, transpileIfNecessary } from './helpers/transpile';

const cwd = process.cwd();

/**
 * This provides the default path for a target's contents, both in the input and output directories.
 */
const getTargetPath = ({ target }: { target: Target }): string => {
  switch (target) {
    default:
      return kebabCase(target);
  }
};

const DEFAULT_CONFIG = {
  targets: [],
  dest: 'output',
  files: 'src/*',
  overridesDir: 'overrides',
  getTargetPath,
  options: {},
} satisfies Partial<UnisynthConfig>;

const getOptions = (config?: UnisynthConfig): UnisynthConfig => {
  const newConfig: UnisynthConfig = {
    ...DEFAULT_CONFIG,
    ...config,
    options: {
      ...DEFAULT_CONFIG.options,
      ...config?.options,
    },
    generators: Object.assign(targets, config?.generators),
  };

  /**
   * Apply common options to all targets
   */
  if (newConfig.commonOptions) {
    for (const target of newConfig.targets || []) {
      newConfig.options[target] = {
        ...newConfig.commonOptions,
        ...newConfig.options[target],
        plugins: [
          ...(newConfig.commonOptions?.plugins || []),
          ...(newConfig.options[target]?.plugins || []),
        ],
      } as any;
    }
  }

  return newConfig;
};

async function clean(options: UnisynthConfig, target: Target) {
  const outputPattern = `${options.dest}/${options.getTargetPath({ target })}/${options.files}`;
  const oldFiles = getFiles({ files: outputPattern, exclude: options.exclude });

  const newFilenames = getFiles({ files: options.files, exclude: options.exclude })
    .map((path) =>
      checkIsUnisynthComponentFilePath(path)
        ? renameComponentFile({ target, path, options })
        : path.endsWith('.js') || path.endsWith('.ts')
        ? getNonComponentOutputFileName({ target, path, options })
        : undefined,
    )
    .filter((x): x is string => Boolean(x));

  await Promise.all(
    oldFiles.map(async (oldFile) => {
      const fileExists = newFilenames.some((newFile) => oldFile.endsWith(newFile));

      /**
       * We only remove files that were removed from the input files.
       * Modified files will be overwritten, and new files will be created.
       */
      if (!fileExists) {
        await remove(oldFile);
      }
    }),
  );
}

type ParsedUnisynthJson = {
  path: string;
  typescriptUnisynthJson: UnisynthComponent;
  javascriptUnisynthJson: UnisynthComponent;
};

const getRequiredParsers = (
  options: UnisynthConfig,
): { javascript: boolean; typescript: boolean } => {
  const targetsOptions = Object.values(options.options);

  const targetsRequiringTypeScript = targetsOptions.filter((option) => option.typescript).length;
  const needsTypeScript = targetsRequiringTypeScript > 0;

  /**
   * We use 2 ways to check if the user requires a JS output:
   * - either there are fewer `options[target].typescript === true` than there are items in `targets`
   * - either there are fewer `options[target].typescript === true` than there are items in `options.options`
   *
   * The reason for checking in multiple ways is if there is a mismatch between the number of targets in the `targets`
   * array compared to the configurations in `options.options`.
   */
  const needsJavaScript =
    options.targets.length > targetsRequiringTypeScript ||
    targetsOptions.length > targetsRequiringTypeScript;

  return {
    typescript: needsTypeScript,
    javascript: needsJavaScript,
  };
};

const parseJsxComponent = async ({
  options,
  path,
  file,
  tsProject,
}: {
  options: UnisynthConfig;
  path: string;
  file: string;
  tsProject: ParseUnisynthOptions['tsProject'];
}) => {
  const requiredParses = getRequiredParsers(options);
  let typescriptUnisynthJson: ParsedUnisynthJson['typescriptUnisynthJson'];
  let javascriptUnisynthJson: ParsedUnisynthJson['javascriptUnisynthJson'];

  const jsxArgs: ParseUnisynthOptions = {
    ...options.parserOptions?.jsx,
    tsProject,
    filePath: path,
    typescript: false,
  };
  if (requiredParses.typescript && requiredParses.javascript) {
    typescriptUnisynthJson = options.parser
      ? await options.parser(file, path)
      : parseJsx(file, { ...jsxArgs, typescript: true });
    javascriptUnisynthJson = options.parser
      ? await options.parser(file, path)
      : parseJsx(file, { ...jsxArgs, typescript: false });
  } else {
    const singleParse = options.parser
      ? await options.parser(file, path)
      : parseJsx(file, { ...jsxArgs, typescript: requiredParses.typescript });

    // technically only one of these will be used, but we set both to simplify things types-wise.
    typescriptUnisynthJson = singleParse;
    javascriptUnisynthJson = singleParse;
  }

  const output: ParsedUnisynthJson = {
    path,
    typescriptUnisynthJson,
    javascriptUnisynthJson,
  };
  return output;
};

const parseSvelteComponent = async ({ path, file }: { path: string; file: string }) => {
  const json = await parseSvelte(file, path);

  const output: ParsedUnisynthJson = {
    path,
    typescriptUnisynthJson: json,
    javascriptUnisynthJson: json,
  };

  return output;
};

const findTsConfigFile = (options: UnisynthConfig) => {
  const optionPath = options.parserOptions?.jsx?.tsConfigFilePath;

  if (optionPath && pathExistsSync(optionPath)) {
    return optionPath;
  }

  const defaultPath = [cwd, 'tsconfig.json'].join('/');

  if (pathExistsSync(defaultPath)) {
    return defaultPath;
  }

  return undefined;
};

const getUnisynthComponentJSONs = async (options: UnisynthConfig): Promise<ParsedUnisynthJson[]> => {
  const paths = getFiles({ files: options.files, exclude: options.exclude }).filter(
    checkIsUnisynthComponentFilePath,
  );

  const tsConfigFilePath = findTsConfigFile(options);

  const tsProject = tsConfigFilePath ? createTypescriptProject(tsConfigFilePath) : undefined;

  return Promise.all(
    paths.map(async (path) => {
      try {
        const file = await readFile(path, 'utf8');
        if (checkIsSvelteComponentFilePath(path)) {
          return await parseSvelteComponent({ path, file });
        } else {
          return await parseJsxComponent({ options, path, file, tsProject });
        }
      } catch (err) {
        console.error('Could not parse file:', path);
        throw err;
      }
    }),
  );
};

interface TargetContext {
  target: Target;
  generator: TranspilerGenerator<Required<UnisynthConfig['options']>[Target]>;
  outputPath: string;
}

interface TargetContextWithConfig extends TargetContext {
  options: UnisynthConfig;
}

const getTargetContexts = (options: UnisynthConfig) =>
  options.targets.map(
    (target): TargetContext => ({
      target,
      generator: options.generators?.[target] as any,
      outputPath: options.getTargetPath({ target }),
    }),
  );

const buildAndOutputNonComponentFiles = async (targetContext: TargetContextWithConfig) => {
  const files = await buildNonComponentFiles(targetContext);
  return await outputNonComponentFiles({ ...targetContext, files });
};

export async function build(config?: UnisynthConfig) {
  // merge default options
  const options = getOptions(config);

  // get all unisynth component JSONs
  const unisynthComponents = await getUnisynthComponentJSONs(options);

  const targetContexts = getTargetContexts(options);

  await Promise.all(
    targetContexts.map(async (targetContext) => {
      // clean output directory
      await clean(options, targetContext.target);
      // clone unisynth JSONs for each target, so we can modify them in each generator without affecting future runs.
      // each generator also clones the JSON before manipulating it, but this is an extra safety measure.
      const files = fastClone(unisynthComponents);

      const x = await Promise.all([
        buildAndOutputNonComponentFiles({ ...targetContext, options }),
        buildAndOutputComponentFiles({ ...targetContext, options, files }),
      ]);

      console.info(
        `Unisynth: ${targetContext.target}: generated ${x[1].length} components, ${x[0].length} regular files.`,
      );
    }),
  );

  console.info('Unisynth: generation completed.');
}

/**
 * Transpiles and outputs Unisynth component files.
 */
async function buildAndOutputComponentFiles({
  target,
  files,
  options,
  generator,
  outputPath,
}: TargetContextWithConfig & { files: ParsedUnisynthJson[] }) {
  const debugTarget = debug(`unisynth:${target}`);
  const shouldOutputTypescript = checkShouldOutputTypeScript({ options, target });

  const output = files.map(async ({ path, typescriptUnisynthJson, javascriptUnisynthJson }) => {
    const outputFilePath = renameComponentFile({ target, path, options });

    /**
     * Try to find override file.
     * NOTE: we use the default `getTargetPath` even if a user-provided alternative is given. That's because the
     * user-provided alternative is only for the output path, not the override input path.
     */

    const overrideFilePath = `${options.overridesDir}/${getTargetPath({ target })}`;
    const overrideFile = await getOverrideFile({
      filename: outputFilePath,
      path: overrideFilePath,
      target,
    });

    debugTarget(`transpiling ${path}...`);
    let transpiled = '';

    if (overrideFile) {
      debugTarget(`override exists for ${path}: ${!!overrideFile}`);
    }
    try {
      const component = shouldOutputTypescript ? typescriptUnisynthJson : javascriptUnisynthJson;

      transpiled = overrideFile ?? generator(options.options[target])({ path, component });
      debugTarget(`Success: transpiled ${path}. Output length: ${transpiled.length}`);
    } catch (error) {
      debugTarget(`Failure: transpiled ${path}.`);
      debugTarget(error);
      throw error;
    }

    transpiled = transformImports({ target, options })(transpiled);

    const outputDir = `${options.dest}/${outputPath}`;

    await outputFile(`${outputDir}/${outputFilePath}`, transpiled);
  });
  return await Promise.all(output);
}

const getNonComponentFileExtension = flow(checkShouldOutputTypeScript, (shouldOutputTypeScript) =>
  shouldOutputTypeScript ? '.ts' : '.js',
);

const getNonComponentOutputFileName = ({
  target,
  options,
  path,
}: {
  path: string;
  target: Target;
  options: UnisynthConfig;
}) => path.replace(/\.tsx?$/, getNonComponentFileExtension({ target, options }));

/**
 * Outputs non-component files to the destination directory, without modifying them.
 */
const outputNonComponentFiles = async ({
  files,
  options,
  outputPath,
  target,
}: TargetContext & {
  files: { path: string; output: string }[];
  options: UnisynthConfig;
}) => {
  const folderPath = `${options.dest}/${outputPath}`;
  return await Promise.all(
    files.map(({ path, output }) =>
      outputFile(
        `${folderPath}/${getNonComponentOutputFileName({ options, path, target })}`,
        output,
      ),
    ),
  );
};

async function buildContextFile({
  target,
  options,
  path,
}: TargetContextWithConfig & { path: string }) {
  let output = (await generateContextFile({ path, options, target })) || '';

  // transpile to JS if necessary
  if (!checkShouldOutputTypeScript({ target, options })) {
    output = await transpile({
      path,
      target,
      content: output,
      options,
    });
  }

  // we remove the `.lite` extension from the path for Context files.
  path = path.replace('.lite.ts', '.ts');

  return {
    path,
    output,
  };
}

/**
 * Transpiles all non-component files, including Context files.
 */
async function buildNonComponentFiles(args: TargetContextWithConfig) {
  const { target, options } = args;
  const nonComponentFiles = getFiles({ files: options.files, exclude: options.exclude }).filter(
    (file) => file.endsWith('.ts') || file.endsWith('.js'),
  );

  return await Promise.all(
    nonComponentFiles.map(async (path): Promise<{ path: string; output: string }> => {
      /**
       * Try to find override file.
       * NOTE: we use the default `getTargetPath` even if a user-provided alternative is given. That's because the
       * user-provided alternative is only for the output path, not the override input path.
       */
      const overrideFilePath = `${options.overridesDir}/${getTargetPath({ target })}/${path}`;

      const overrideFile = (await pathExists(overrideFilePath))
        ? await readFile(overrideFilePath, 'utf8')
        : null;

      if (overrideFile) {
        const output = pipe(
          await transpileIfNecessary({ path, target, content: overrideFile, options }),
          transformImports({ target, options }),
        );

        return { output, path };
      }

      const isContextFile = path.endsWith('.context.lite.ts');
      if (isContextFile) {
        return buildContextFile({ ...args, path });
      }

      const file = await readFile(path, 'utf8');

      const output = pipe(
        await transpileIfNecessary({ path, target, options, content: file }),
        transformImports({ target, options }),
        (code) => mapSignalTypeInTSFile({ code, target }),
        removeUnisynthImport,
      );

      return { output, path };
    }),
  );
}

if (require.main === module) {
  build().catch(console.error);
}
