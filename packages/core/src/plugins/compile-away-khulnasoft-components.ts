import { Khulnasoft, KhulnasoftElement } from '@builder.io/sdk';
import { type Plugin } from '@khulnasoft.com/unisynth';
import json5 from 'json5';
import { omit, pick, round } from 'lodash';
import traverse, { TraverseContext } from 'neotraverse/legacy';
import { createSingleBinding } from '../helpers/bindings';
import { createUnisynthNode } from '../helpers/create-unisynth-node';
import { filterEmptyTextNodes } from '../helpers/filter-empty-text-nodes';
import { isUnisynthNode } from '../helpers/is-unisynth-node';
import { khulnasoftElementToUnisynthNode } from '../parsers/khulnasoft';
import { UnisynthComponent } from '../types/unisynth-component';
import { UnisynthNode } from '../types/unisynth-node';

const getCssFromNode = (node: UnisynthNode) => {
  const css = node.bindings.css?.code;
  if (css) {
    return json5.parse(css);
  }
  return {};
};

function getComponentInputNames(componentName: string): string[] {
  const componentInfo = Khulnasoft.components.find((item) => item.name === componentName);
  return componentInfo?.inputs?.map((item) => item.name) || [];
}

const wrapOutput = (
  node: UnisynthNode,
  child: UnisynthNode | UnisynthNode[],
  components: CompileAwayComponentsMap,
) => {
  const inputNames = getComponentInputNames(node.name);
  compileAwayKhulnasoftComponentsFromTree(child as any, components);
  return createUnisynthNode({
    ...node,
    properties: {
      ...omit(node.properties, ...inputNames),
    },
    bindings: {
      ...omit(node.bindings, ...inputNames),
    },
    // TODO: forward tagName as a $tagName="..."
    name: node.properties._tagName || node.properties.$tagName || 'div',
    children: Array.isArray(child) ? child : [child],
  });
};

type CompileAwayComponentsMap = {
  [key: string]: (
    node: UnisynthNode,
    context: TraverseContext,
    components: CompileAwayComponentsMap,
  ) => UnisynthNode | void;
};

interface AccordionItem {
  title: KhulnasoftElement[];
  detail: KhulnasoftElement[];
}

export const components: CompileAwayComponentsMap = {
  CoreButton(node: UnisynthNode, context, components) {
    const properties: Record<string, string> = {};
    const bindings: Record<string, string> = {};

    if (!node.properties.href && node.bindings.css) {
      const css = json5.parse(node.bindings.css.code);
      // When using button tag ensure we have all: unset and
      // be sure that is the first style in the list
      node.bindings.css.code = json5.stringify({
        all: 'unset',
        ...css,
      });
    }

    if ('link' in node.properties) {
      properties.href = node.properties.link!;
    }
    if ('link' in node.bindings) {
      bindings.href = node.properties.link!;
    }
    if ('text' in node.properties) {
      node.children = [
        createUnisynthNode({
          properties: {
            _text: node.properties.text!,
          },
        }),
      ];
    }
    if ('text' in node.bindings) {
      node.children = [
        createUnisynthNode({
          bindings: {
            _text: node.bindings.text!,
          },
        }),
      ];
    }
    if ('openInNewTab' in node.bindings) {
      bindings.target = `${node.bindings.openInNewTab} ? '_blank' : '_self'`;
    }

    const omitFields = ['link', 'openInNewTab', 'text'];

    const hasLink = node.properties.link || node.bindings.link;

    return createUnisynthNode({
      ...node,
      // TODO: use 'button' tag for no link, and add `all: unset` to CSS string only then
      name: hasLink ? 'a' : 'button',
      properties: {
        ...omit(node.properties, omitFields),
        ...properties,
      },
      bindings: {
        ...omit(node.bindings, omitFields),
        ...bindings,
      },
    });
  },
  Embed(node: UnisynthNode, context, components) {
    return wrapOutput(
      node,
      createUnisynthNode({
        name: (node.properties.khulnasoftTag as string) || 'div',
        properties: {
          innerHTML: node.properties.content || '',
        },
      }),
      components,
    );
  },
  KhulnasoftAccordion(node: UnisynthNode, context, components) {
    const itemsJSON = node.bindings.items?.code || '[]';
    const accordionItems: AccordionItem[] = json5.parse(itemsJSON);
    const children: UnisynthNode[] = accordionItems.map((accordionItem) => {
      const titleChildren: UnisynthNode[] = accordionItem.title.map((element) =>
        khulnasoftElementToUnisynthNode(element, {
          includeKhulnasoftExtras: true,
          preserveTextBlocks: true,
        }),
      );
      const detailChildren: UnisynthNode[] = accordionItem.detail.map((element) =>
        khulnasoftElementToUnisynthNode(element, {
          includeKhulnasoftExtras: true,
          preserveTextBlocks: true,
        }),
      );
      return createUnisynthNode({
        name: 'div',
        properties: { khulnasoft: 'accordion' },
        children: [
          createUnisynthNode({
            name: 'div',
            properties: { khulnasoft: 'accordion-title' },
            children: titleChildren,
          }),
          createUnisynthNode({
            name: 'div',
            properties: { khulnasoft: 'accordion-detail' },
            children: detailChildren,
          }),
        ],
      });
    });
    return wrapOutput(
      node,
      createUnisynthNode({
        name: (node.properties.khulnasoftTag as string) || 'div',
        properties: {
          $name: 'accordion',
        },
        children: children,
      }),
      components,
    );
  },
  KhulnasoftMasonry() {
    // TODO
    return createUnisynthNode({
      name: 'div',
      properties: { 'data-missing-component': 'KhulnasoftMasonry' },
    });
  },
  KhulnasoftTabs() {
    // TODO
    return createUnisynthNode({
      name: 'div',
      properties: { 'data-missing-component': 'KhulnasoftTabs' },
    });
  },
  KhulnasoftCarousel() {
    // TODO
    return createUnisynthNode({
      name: 'div',
      properties: { 'data-missing-component': 'KhulnasoftCarousel' },
    });
  },
  CustomCode(node: UnisynthNode, context, components) {
    const bindings: UnisynthNode['bindings'] = {};
    if (node?.bindings?.code) {
      bindings.innerHTML = node.bindings.code;
    }
    return wrapOutput(
      node,
      createUnisynthNode({
        name: (node.properties.khulnasoftTag as string) || 'div',
        properties: {
          innerHTML: node.properties.code || '',
        },
        bindings: bindings,
      }),
      components,
    );
  },
  CoreSection(node: UnisynthNode, context, components) {
    const css = getCssFromNode(node);
    return wrapOutput(
      node,
      createUnisynthNode({
        name: 'section',
        properties: {
          ...node.properties,
          $name: 'section',
          ...(node.bindings.lazyLoad?.code === 'true' && {
            lazyLoad: 'true',
          }),
        },
        bindings: {
          css: createSingleBinding({
            code: JSON.stringify({
              ...css,
              width: '100%',
              alignSelf: 'stretch',
              flexGrow: '1',
              boxSizing: 'border-box',
              maxWidth: `${
                (node.bindings.maxWidth?.code && Number(node.bindings.maxWidth.code)) || 1200
              }px`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              marginLeft: 'auto',
              marginRight: 'auto',
            }),
          }),
        },
        children: node.children,
      }),
      components,
    );
  },
  Columns(node: UnisynthNode, context, components) {
    const columns = node.children.filter(filterEmptyTextNodes).map((item) => ({
      width: parseFloat(item.properties.width || item.bindings.width?.code || '0') || 0,
      children: item.children,
    }));
    const gutterSize = (node.properties.getterSize && parseFloat(node.properties.getterSize)) || 20;

    function getWidth(index: number) {
      return (columns[index] && columns[index].width) || 100 / columns.length;
    }

    function getColumnWidth(index: number) {
      return `${Math.round(getWidth(index))}%`;
    }
    const { properties } = node;

    return wrapOutput(
      node,
      createUnisynthNode({
        name: 'div',

        bindings: {
          css: createSingleBinding({
            code: JSON.stringify({
              gap: `${gutterSize}px`,
              display: 'flex',
              ...(properties.stackColumnsAt === 'never'
                ? {}
                : {
                    [`@media (max-width: ${properties.stackColumnsAt === 'mobile' ? 640 : 991}px)`]:
                      {
                        flexDirection:
                          properties.reverseColumnsWhenStacked === 'true'
                            ? 'column-reverse'
                            : 'column',
                        alignItems: 'stretch',
                        gap: `0px`,
                      },
                  }),
            }),
          }),
        },
        children: columns.map((col, index) => {
          return createUnisynthNode({
            name: 'div',
            properties: {
              $name: 'column',
            },
            bindings: {
              css: createSingleBinding({
                code: JSON.stringify({
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  lineHeight: 'normal',

                  width: `${getColumnWidth(index)}`,
                  marginLeft: `${index === 0 ? 0 : gutterSize}px`,
                  ...(properties.stackColumnsAt === 'never'
                    ? {}
                    : {
                        [`@media (max-width: ${
                          properties.stackColumnsAt === 'mobile' ? 640 : 991
                        }px)`]: {
                          width: '100%',
                          marginLeft: 0,
                        },
                      }),
                }),
              }),
            },
            children: col.children,
          });
        }),
      }),
      components,
    );
  },
  Image(node: UnisynthNode, context, components) {
    const { backgroundSize, backgroundPosition } = node.properties;
    const { srcset } = node.properties;

    let aspectRatio = node.bindings.aspectRatio?.code
      ? parseFloat(node.bindings.aspectRatio.code as string)
      : null;
    if (typeof aspectRatio === 'number' && isNaN(aspectRatio)) {
      aspectRatio = null;
    }

    const image = node.properties.image!;
    const srcSet = srcset || generateKhulnasoftIoSrcSet(image);
    const css = getCssFromNode(node);
    const noWebp = node.bindings.noWebp?.code === 'true';

    const img = createUnisynthNode({
      name: 'img',
      properties: noUndefined({
        loading: 'lazy',
        sizes: node.properties.sizes,
        alt: node.properties.altText,
        // We set noWebp to true for SVGs. in this case, we
        // also don't need srcset, just a src is better
        ...(noWebp
          ? {
              src: image,
            }
          : {
              srcSet: srcSet || null,
            }),
      }),
      bindings: noUndefined({
        src: node.bindings.image?.code && { code: node.bindings.image?.code },
        sizes: node.bindings.sizes?.code && { code: node.bindings.sizes?.code },
        style: node.bindings.style?.code && { code: node.bindings.style?.code },
        css: createSingleBinding({
          code: JSON.stringify({
            aspectRatio: aspectRatio ? String(round(1 / aspectRatio, 2)) : undefined,
            objectFit: backgroundSize || 'cover',
            objectPosition: backgroundPosition || 'center',
            width: '100%',
            ...css,
            display: undefined,
            flexDirection: undefined,
            position: css.position === 'relative' ? undefined : css.position,
          }),
        }),
      }),
    });

    if (!node.children?.length) {
      return img;
    }

    // TODO: deal with links: anchor tag and href
    const root = createUnisynthNode({
      name: 'div',
      bindings: noUndefined({
        css: createSingleBinding({
          code: JSON.stringify({
            display: 'flex',
            flexDirection: 'column',
            ...css,
            position: 'relative',
          }),
        }),
      }),
      children: [
        {
          ...img,
          bindings: {
            ...img.bindings,
            css: createSingleBinding({
              code: JSON.stringify({
                position: 'absolute',
                inset: '0',
                height: '100%',
                width: '100%',
                objectFit: backgroundSize || 'cover',
                objectPosition: backgroundPosition || 'center',
              }),
            }),
          },
        },
        ...node.children.map((child) => {
          const newChild = {
            ...child,
            bindings: {
              ...child.bindings,
              css: createSingleBinding({
                code: JSON.stringify({
                  position: 'relative',
                  ...getCssFromNode(child),
                }),
              }),
            },
          };
          compileAwayKhulnasoftComponentsFromTree(newChild, components);
          return newChild;
        }),
      ],
    });

    return root;
  },
  Video(node: UnisynthNode, context, components) {
    let aspectRatio = node.bindings.aspectRatio?.code
      ? parseFloat(node.bindings.aspectRatio.code as string)
      : null;
    if (typeof aspectRatio === 'number' && isNaN(aspectRatio)) {
      aspectRatio = null;
    }
    const videoContainerNodes: UnisynthNode[] = [];

    const css = getCssFromNode(node);

    videoContainerNodes.push(
      createUnisynthNode({
        name: 'video',
        properties: noUndefined({
          poster: node.properties.posterImage,
          autoplay: node.properties.autoPlay,
          muted: node.properties.muted,
          controls: node.properties.controls,
          loop: node.properties.loop,
          playsinline: node.properties.playsInline,
          preload: node.properties.lazy ? 'none' : undefined,
        }),
        bindings: noUndefined({
          poster: node.bindings.posterImage?.code && {
            code: node.bindings.posterImage?.code,
          },
          autoplay: node.bindings.autoPlay?.code && {
            code: node.bindings.autoPlay?.code,
          },
          muted: node.bindings.muted?.code && {
            code: node.bindings.muted?.code,
          },
          controls: node.bindings.controls?.code && {
            code: node.bindings.controls?.code,
          },
          playsinline: node.bindings.playsInline?.code && {
            code: node.bindings.playsInline?.code,
          },
          loop: node.bindings.loop?.code && { code: node.bindings.loop?.code },
          css: createSingleBinding({
            code: JSON.stringify({
              width: '100%',
              height: '100%',
              objectFit: node.properties.fit,
              objectPosition: node.properties.position,
              borderRadius: '1',
              position: aspectRatio ? 'absolute' : '',
              ...css,
            }),
          }),
        }),
        children: [
          createUnisynthNode({
            name: 'source',
            properties: {
              type: 'video/mp4',
              src: node.properties.video,
            },
            bindings: noUndefined({
              src: node.bindings.video?.code && {
                code: node.bindings.video?.code as string,
              },
            }),
          }),
        ],
      }),
    );

    aspectRatio &&
      videoContainerNodes.push(
        createUnisynthNode({
          name: 'div',

          bindings: {
            css: createSingleBinding({
              code: JSON.stringify({
                width: '100%',
                paddingTop: aspectRatio * 100 + '%',
                pointerEvents: 'none',
                fontSize: '0',
              }),
            }),
          },
        }),
      );

    node.children &&
      node.children.length &&
      videoContainerNodes.push(
        createUnisynthNode({
          name: 'div',

          bindings: {
            css: createSingleBinding({
              code: JSON.stringify({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
              }),
            }),
          },
          children: node.children,
        }),
      );

    const videoContainer = createUnisynthNode({
      name: 'div',

      bindings: {
        css: createSingleBinding({ code: JSON.stringify({ position: 'relative' }) }),
      },
      children: videoContainerNodes,
    });
    return wrapOutput(node, videoContainer, components);
  },
};

type CompileAwayKhulnasoftComponentsOptions = {
  only?: string[];
  omit?: string[];
};

export const compileAwayKhulnasoftComponentsFromTree = (
  tree: UnisynthNode | UnisynthComponent,
  components: CompileAwayComponentsMap,
) => {
  traverse(tree).forEach(function (item) {
    if (isUnisynthNode(item)) {
      const mapper = components[item.name];
      if (mapper) {
        const result = mapper(item, this, components);
        if (result) {
          this.update(result);
        }
      }
    }
  });
};

export const compileAwayKhulnasoftComponents = (
  pluginOptions: CompileAwayKhulnasoftComponentsOptions = {},
): Plugin => {
  let obj = components;
  if (pluginOptions.omit) {
    obj = omit(obj, pluginOptions.omit);
  }
  if (pluginOptions.only) {
    obj = pick(obj, pluginOptions.only);
  }

  return (options?: any) => ({
    json: {
      pre: (json: UnisynthComponent) => {
        compileAwayKhulnasoftComponentsFromTree(json, obj);
      },
    },
  });
};

function updateQueryParam(uri = '', key: string, value: string) {
  const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
  const separator = uri.indexOf('?') !== -1 ? '&' : '?';
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + '=' + encodeURIComponent(value) + '$2');
  }

  return uri + separator + key + '=' + encodeURIComponent(value);
}

function generateKhulnasoftIoSrcSet(image: string): string {
  const isKhulnasoftIo = !!(image || '').match(/khulnasoft\.io/);
  return isKhulnasoftIo
    ? [100, 200, 400, 800, 1200, 1600, 2000]
        .map((size) => `${updateQueryParam(image, 'width', String(size))} ${size}w`)
        .concat([image])
        .join(', ')
    : '';
}

function noUndefined(obj: Record<string, any>): Record<string, any> {
  const cleanObj: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value != null) {
        if (typeof value == 'object') {
          const ret = noUndefined(value);
          if (Object.keys(ret).length) {
            cleanObj[key] = ret;
          }
        } else {
          cleanObj[key] = value;
        }
      }
    }
  }
  return cleanObj;
}
