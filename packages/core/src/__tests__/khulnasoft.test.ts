import { componentToHtml } from '@/generators/html';
import { componentToKhulnasoft } from '@/generators/khulnasoft';
import { componentToReact } from '@/generators/react';
import { componentToUnisynth } from '@/generators/unisynth';
import { ToUnisynthOptions } from '@/generators/unisynth/types';
import { dedent } from '@/helpers/dedent';
import { parseJsx } from '@/parsers/jsx';
import { extractStateHook, khulnasoftContentToUnisynthComponent } from '@/parsers/khulnasoft';
import { compileAwayKhulnasoftComponents } from '@/plugins/compile-away-khulnasoft-components';
import { KhulnasoftContent } from '@builder.io/sdk';

import asyncBindings from './data/basic-ref-assignment.raw.tsx?raw';
import columns from './data/blocks/columns.raw.tsx?raw';
import customCode from './data/blocks/custom-code.raw.tsx?raw';
import embed from './data/blocks/embed.raw.tsx?raw';
import image from './data/blocks/image.raw.tsx?raw';
import indexInFor from './data/blocks/index-in-for.raw.tsx?raw';
import stamped from './data/blocks/stamped-io.raw.tsx?raw';
import advancedFor from './data/for/advanced-for.raw.tsx?raw';
import booleanContent from './data/khulnasoft/boolean.json?raw';
import customComponentSlotPropertyContent from './data/khulnasoft/custom-component-slot-property.json?raw';
import lazyLoadSection from './data/khulnasoft/lazy-load-section.json?raw';
import slotsContent from './data/khulnasoft/slots.json?raw';
import slots2Content from './data/khulnasoft/slots2.json?raw';
import textBindings from './data/khulnasoft/text-bindings.json?raw';
import show from './data/show/show-expressions.raw.tsx?raw';

const unisynthOptions: ToUnisynthOptions = {
  format: 'legacy',
};

describe('Khulnasoft', () => {
  test('extractStateHook', () => {
    const code = `useState({ foo: 'bar' }); alert('hi');`;
    expect(extractStateHook(code)).matchSnapshot();
  });

  test('Stamped', () => {
    const component = parseJsx(stamped);
    const khulnasoftJson = componentToKhulnasoft()({ component });
    expect(khulnasoftJson).toMatchSnapshot();

    const backToUnisynth = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    const unisynth = componentToUnisynth()({ component: backToUnisynth });
    expect(unisynth).toMatchSnapshot();
  });

  test('Show', () => {
    const component = parseJsx(show);
    const khulnasoftJson = componentToKhulnasoft()({ component });
    expect(khulnasoftJson).toMatchSnapshot();

    const backToUnisynth = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    const unisynth = componentToUnisynth()({ component: backToUnisynth });
    expect(unisynth).toMatchSnapshot();
  });

  test('Advanced For', () => {
    const component = parseJsx(advancedFor);
    const khulnasoftJson = componentToKhulnasoft()({ component });
    expect(khulnasoftJson).toMatchSnapshot();

    const backToUnisynth = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    const unisynth = componentToUnisynth()({ component: backToUnisynth });
    expect(unisynth).toMatchSnapshot();
  });

  test('CustomCode', () => {
    const component = parseJsx(customCode);
    const khulnasoftJson = componentToKhulnasoft()({ component });
    expect(khulnasoftJson).toMatchSnapshot();

    const backToUnisynth = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    const unisynth = componentToUnisynth()({ component: backToUnisynth });
    expect(unisynth).toMatchSnapshot();
  });

  test('async bindings', () => {
    const component = parseJsx(asyncBindings);
    const khulnasoftJson = componentToKhulnasoft()({ component });
    expect(khulnasoftJson).toMatchSnapshot();

    const backToUnisynth = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    const unisynth = componentToUnisynth()({ component: backToUnisynth });
    expect(unisynth).toMatchSnapshot();
  });

  test('Embed', () => {
    const component = parseJsx(embed);
    const khulnasoftJson = componentToKhulnasoft()({ component });
    expect(khulnasoftJson).toMatchSnapshot();

    const backToUnisynth = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    const unisynth = componentToUnisynth()({ component: backToUnisynth });
    expect(unisynth).toMatchSnapshot();
  });

  test('Index inside For', () => {
    const component = parseJsx(indexInFor);
    const khulnasoftJson = componentToKhulnasoft()({ component });
    const backToUnisynth = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    const unisynth = componentToUnisynth()({ component: backToUnisynth });
    expect(unisynth).toMatchSnapshot();
  });

  test('Image', () => {
    const component = parseJsx(image);
    const khulnasoftJson = componentToKhulnasoft()({ component });
    expect(khulnasoftJson).toMatchSnapshot();

    const backToUnisynth = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    const unisynth = componentToUnisynth()({ component: backToUnisynth });
    expect(unisynth).toMatchSnapshot();
  });

  test('Columns', () => {
    const component = parseJsx(columns);
    const khulnasoftJson = componentToKhulnasoft()({ component });
    expect(khulnasoftJson).toMatchSnapshot();

    const backToUnisynth = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    const unisynth = componentToUnisynth()({ component: backToUnisynth });
    expect(unisynth).toMatchSnapshot();
  });

  test('Section', async () => {
    const component = khulnasoftContentToUnisynthComponent(JSON.parse(lazyLoadSection));

    const html = await componentToHtml({
      plugins: [compileAwayKhulnasoftComponents()],
    })({ component });

    expect(html).toMatchSnapshot();
  });

  test('Text with bindings', async () => {
    const originalKhulnasoft = JSON.parse(textBindings);
    const component = khulnasoftContentToUnisynthComponent(originalKhulnasoft);
    const unisynthJsx = componentToUnisynth()({ component });

    expect(component).toMatchSnapshot();
    expect(unisynthJsx).toMatchSnapshot();

    const backToKhulnasoft = componentToKhulnasoft()({ component });
    expect(backToKhulnasoft).toMatchSnapshot();
  });

  test('Regenerate Image', () => {
    const code = dedent`
      import { useStore } from "unisynth";
      import { Image } from "@components";

      export default function MyComponent(props) {
        const state = useStore({ people: ["Steve", "Sewell"] });

        return (
          <div
            css={{
              padding: "20px",
            }}
          >
            <Image
              image="https://cdn.khulnasoft.com/api/v1/image/foobar"
              sizes="100vw"
              backgroundSize="contain"
              css={{
                marignTop: "50px",
                display: "block",
              }}
            />
          </div>
        );
      }
    `;

    const component = parseJsx(code);
    const khulnasoftJson = componentToKhulnasoft()({ component });
    const backToUnisynth = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    expect(backToUnisynth.state).toEqual(component.state);
    const unisynth = componentToUnisynth(unisynthOptions)({
      component: backToUnisynth,
    });
    expect(unisynth.trim()).toEqual(code.trim());
    const react = componentToReact({
      plugins: [compileAwayKhulnasoftComponents()],
    })({ component });
    expect(react).toMatchSnapshot();
  });

  test('Regenerate Text', () => {
    const code = dedent`
      import { useStore } from "unisynth";

      export default function MyComponent(props) {
        const state = useStore({ people: ["Steve", "Sewell"] });

        return (
          <div
            css={{
              padding: "20px",
            }}
          >
            <h2
              css={{
                marginBottom: "20px",
              }}
            >
              Hello!
            </h2>
          </div>
        );
      }
    `;

    const component = parseJsx(code);
    const khulnasoftJson = componentToKhulnasoft()({ component });
    const backToUnisynth = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    const unisynth = componentToUnisynth(unisynthOptions)({
      component: backToUnisynth,
    });
    expect(unisynth.trim()).toEqual(code.trim());
  });

  test('Regenerate loop', () => {
    const code = dedent`
      import { useStore, For } from "unisynth";

      export default function MyComponent(props) {
        const state = useStore({ people: ["Steve", "Sewell"] });

        onMount(() => {
          state.people.push("John");
        });

        return (
          <For each={state.people}>
            {(person, index) => (
              <div
                key={person}
                css={{
                  padding: "10px 0",
                }}
              >
                <span>{person}</span>
                <span>{index}</span>
              </div>
            )}
          </For>
        );
      }
    `;

    const component = parseJsx(code);
    const khulnasoftJson = componentToKhulnasoft()({ component });
    const backToUnisynth = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    const unisynth = componentToUnisynth(unisynthOptions)({
      component: backToUnisynth,
    });
    expect(unisynth.trim()).toEqual(code.trim());
  });

  test('Regenerate loop with Text node when using CSS', () => {
    const khulnasoftJson: KhulnasoftContent = {
      data: {
        blocks: [
          {
            '@type': '@builder.io/sdk:Element',
            '@version': 2,
            repeat: {
              collection: 'state.submenusItem.menuItems',
            },
            id: 'khulnasoft-ID',
            class: 'class-id',
            component: {
              name: 'Text',
              options: {
                text: 'text-content',
              },
            },
            responsiveStyles: {
              large: {
                padding: '2px',
              },
            },
          },
        ],
      },
    } as KhulnasoftContent;
    const backToUnisynth = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    const unisynth = componentToUnisynth(unisynthOptions)({
      component: backToUnisynth,
    });
    expect(unisynth.trim()).toMatchSnapshot();
  });

  test('No srcset for SVG', async () => {
    const khulnasoftJson: KhulnasoftContent = {
      data: {
        blocks: [
          {
            '@type': '@builder.io/sdk:Element',
            component: {
              name: 'Image',
              options: {
                image: 'https://cdn.khulnasoft.com/api/v1/image/dummy.svg',
                noWebp: true,
              },
            },
          },
        ],
      },
    } as KhulnasoftContent;
    const component = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    const html = await componentToHtml({
      plugins: [compileAwayKhulnasoftComponents()],
    })({ component });
    expect(html).toMatchSnapshot();
  });

  test('Regenerate custom Hero', () => {
    const code = dedent`
      import { Hero } from "@components";

      export default function MyComponent(props) {
        return (
          <Hero
            title="Your Title Here"
            image="https://cdn.khulnasoft.com/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F52dcecf48f9c48cc8ddd8f81fec63236"
            buttonLink="https://example.com"
            buttonText="Click"
            multiBinding={{
              hello: state.message,
            }}
            height={400}
            css={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              position: "relative",
              flexShrink: "0",
              boxSizing: "border-box",
              marginTop: "200px",
            }}
          />
        );
      }
    `;

    const component = parseJsx(code);
    expect(component).toMatchSnapshot();
    const khulnasoftJson = componentToKhulnasoft()({ component });
    expect(khulnasoftJson).toMatchSnapshot();
    const backToUnisynth = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    expect(backToUnisynth).toMatchSnapshot();
    const unisynth = componentToUnisynth(unisynthOptions)({
      component: backToUnisynth,
    });
    expect(unisynth.trim()).toEqual(code.trim());
  });

  // TODO: fix divs and CoreFragment - need to find way to reproduce
  test.skip('Regenerate fragments', () => {
    const code = dedent`
      export default function MyComponent(props) {
        return (
          <>
            Hello world

            <>
              <Fragment>Hi</Fragment>
            </>
          </>
        );
      }
    `;

    const component = parseJsx(code);
    expect(component).toMatchSnapshot();
    const khulnasoftJson = componentToKhulnasoft()({ component });
    expect(khulnasoftJson).toMatchSnapshot();
    const backToUnisynth = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    expect(backToUnisynth).toMatchSnapshot();
    const unisynth = componentToUnisynth(unisynthOptions)({
      component: backToUnisynth,
    });
    expect(unisynth.trim()).toEqual(code.trim());
  });

  // TODO: get passing, don't add extra divs. or at least use spans instead so don't break layout
  test.skip('Regenerate span text', () => {
    const code = dedent`
      export default function MyComponent(props) {
        return (
          <div
            css={{
              display: "block",
            }}
          >
            Hi there
            <span
              css={{
                color: "red",
              }}
            >
              Hello world
            </span>
          </div>
        );
      }
    `;

    const component = parseJsx(code);
    const khulnasoftJson = componentToKhulnasoft()({ component });
    const backToUnisynth = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    const unisynth = componentToUnisynth(unisynthOptions)({
      component: backToUnisynth,
    });
    expect(unisynth.trim()).toEqual(code.trim());
  });

  test('slots', async () => {
    const component = khulnasoftContentToUnisynthComponent(JSON.parse(slotsContent));

    const out = await componentToReact({
      plugins: [compileAwayKhulnasoftComponents()],
    })({ component });

    expect(component).toMatchSnapshot();
    expect(out).toMatchSnapshot();
  });

  test('slots2', async () => {
    const component = khulnasoftContentToUnisynthComponent(JSON.parse(slots2Content));

    const out = await componentToReact({
      plugins: [compileAwayKhulnasoftComponents()],
    })({ component });

    expect(component).toMatchSnapshot();
    expect(out).toMatchSnapshot();
  });

  test('customComponentSlotProperty', async () => {
    const component = khulnasoftContentToUnisynthComponent(
      JSON.parse(customComponentSlotPropertyContent),
    );

    const out = await componentToReact({
      plugins: [compileAwayKhulnasoftComponents()],
    })({ component });

    expect(component).toMatchSnapshot();
    expect(out).toMatchSnapshot();
  });

  test('booleans', async () => {
    const component = khulnasoftContentToUnisynthComponent(JSON.parse(booleanContent));

    const out = await componentToReact({
      plugins: [compileAwayKhulnasoftComponents()],
    })({ component });

    expect(component).toMatchSnapshot();
    expect(out).toMatchSnapshot();
  });

  test('bindings', () => {
    const component = khulnasoftContentToUnisynthComponent(bindingJson as any as KhulnasoftContent);
    expect(component).toMatchSnapshot();
    const unisynth = componentToUnisynth(unisynthOptions)({
      component,
    });
    expect(unisynth).toMatchSnapshot();
  });

  test('preserve cssCode when converting', () => {
    const khulnasoftJson: KhulnasoftContent = {
      data: {
        cssCode: dedent`
        .foo {
          background: green;
        }

        .bar {
          font-weight: bold;
        }
      `,
        blocks: [],
      },
    };
    const khulnasoftToUnisynth = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    expect(khulnasoftToUnisynth.meta.cssCode).toMatchSnapshot();

    const unisynthToKhulnasoft = componentToKhulnasoft()({ component: khulnasoftToUnisynth })!;
    expect(unisynthToKhulnasoft.data!.cssCode).toMatchSnapshot();

    const jsx = componentToUnisynth(unisynthOptions)({
      component: khulnasoftToUnisynth,
    });
    expect(jsx).toMatchSnapshot();

    const jsxToUnisynth = parseJsx(jsx);
    expect(jsxToUnisynth.style).toMatchSnapshot();
  });

  test('Snapshot PersonalizedContainer', () => {
    const code = dedent`
      import { PersonalizationContainer, Variant } from "@components";

      export default function MyComponent(props) {
        return (
          <PersonalizationContainer>
            <Variant
              name="variant1"
              startDate="2024-01-01"
              query={{
                property: "urlPath",
                operation: "is",
                value: "/home",
              }}
            >
              <div>Home</div>
              <div>Div</div>
            </Variant>
            <PersonalizationOption
              name="2"
              query={[
                {
                  property: "gendr",
                  operation: "is",
                  value: ["male", "female"],
                },
              ]}
            >
              <>Male</>
            </PersonalizationOption>
            <Variant>
              <div>Default</div>
            </Variant>
            <div>More tree</div>

          </PersonalizationContainer>
        );
      }
    `;

    const component = parseJsx(code);
    const khulnasoftJson = componentToKhulnasoft()({ component });
    expect(khulnasoftJson.data?.blocks?.[0]).toMatchSnapshot();

    const backToUnisynth = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    const unisynth = componentToUnisynth(unisynthOptions)({
      component: backToUnisynth,
    });
    expect(unisynth.trim()).toMatchSnapshot();
  });

  test('Regenerate PersonalizedContainer', () => {
    const code = dedent`
      import { PersonalizationContainer, Variant } from "@components";

      export default function MyComponent(props) {
        return (
          <PersonalizationContainer>
            <Variant
              name="2"
              startDate="2024-01-01"
              endDate="2024-01-31"
              query={[
                {
                  property: "gendr",
                  operation: "is",
                  value: "male",
                },
              ]}
            >
              <div>Male</div>
            </Variant>
            <Variant default="">
              <div>Default</div>
            </Variant>
          </PersonalizationContainer>
        );
      }
    `;

    const component = parseJsx(code);
    const khulnasoftJson = componentToKhulnasoft()({ component });
    const backToUnisynth = khulnasoftContentToUnisynthComponent(khulnasoftJson);
    const unisynth = componentToUnisynth(unisynthOptions)({
      component: backToUnisynth,
    });
    expect(unisynth.trim()).toEqual(code.trim());
  });

  test('nodes as props', () => {
    const content = {
      data: {
        blocks: [
          {
            '@type': '@builder.io/sdk:Element' as const,
            component: {
              name: 'Foo',
              options: {
                prop: [
                  {
                    '@type': '@builder.io/sdk:Element' as const,
                    component: {
                      name: 'Bar',
                      options: {
                        hello: 'world',
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    };

    const unisynthJson = khulnasoftContentToUnisynthComponent(content);
    expect(unisynthJson).toMatchSnapshot();
    const unisynth = componentToUnisynth(unisynthOptions)({
      component: unisynthJson,
    });

    expect(unisynth).toMatchSnapshot();

    const khulnasoft = parseJsx(unisynth);
    expect(khulnasoft).toMatchSnapshot();
    const json = componentToKhulnasoft()({ component: khulnasoft });
    expect(json).toMatchSnapshot();
    expect(json.data?.blocks?.[0]?.component?.name).toBe('Foo');
    expect(json.data?.blocks?.[0]?.component?.options?.prop?.[0]?.component?.options.hello).toBe(
      'world',
    );
  });
});

const bindingJson = {
  data: {
    inputs: [
      {
        '@type': '@khulnasoft.com/core:Field',
        meta: {},
        name: 'text',
        type: 'text',
        defaultValue: 'Hello',
        required: false,
        subFields: [],
        helperText: '',
        autoFocus: false,
        simpleTextOnly: false,
        disallowRemove: false,
        broadcast: false,
        bubble: false,
        hideFromUI: false,
        hideFromFieldsEditor: false,
        showTemplatePicker: true,
        permissionsRequiredToEdit: '',
        advanced: false,
        copyOnAdd: true,
        onChange: '',
        showIf: '',
        mandatory: false,
        hidden: false,
        noPhotoPicker: false,
        model: '',
        supportsAiGeneration: false,
        defaultCollapsed: false,
      },
    ],
    cssCode: 'khulnasoft-component { max-width: none !important; }',
    blocks: [
      {
        component: {
          name: 'Button',
          options: {
            label: 'hello',
          },
        },
        code: {
          bindings: {
            'component.options.label': 'state.text',
          },
        },
      },
      {
        '@type': '@builder.io/sdk:Element',
        '@version': 2,
        id: 'khulnasoft-1e4cca42847b4712ae978bc679bf1d4a',
        meta: {
          id: '103:1952',
          type: 'COMPONENT',
          name: 'Frame 94',
          componentProperties: null,
          fromFigma: true,
          vcpImportId: 'vcp-635bba9daed9496f82e2b1009dff92a2',
        },
        children: [
          {
            '@type': '@builder.io/sdk:Element',
            '@version': 2,
            bindings: {
              'component.options.text': 'var _virtual_index=state.text;return _virtual_index',
            },
            code: { bindings: { 'component.options.text': 'state.text' } },
            layerName: 'Book an Appointment',
            id: 'khulnasoft-559bbc2a33124e8e843ddec300dcb5a9',
            meta: {
              id: '103:1951',
              type: 'TEXT',
              name: 'Book an Appointment',
              componentPropertyReferences: { characters: 'Text#103:0' },
            },
            component: { name: 'Text', options: { text: 'BUY NOW' } },
          },
        ],
        responsiveStyles: {
          large: {
            backgroundColor: 'rgba(0, 0, 0, 1)',
            display: 'flex',
            paddingLeft: '72px',
            paddingRight: '72px',
            paddingTop: '25px',
            paddingBottom: '25px',
            alignItems: 'start',
            gap: '10px',
            fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 1)',
            fontWeight: '700',
            textTransform: 'uppercase',
            justifyContent: 'start',
          },
        },
      },
    ],
  },
};
