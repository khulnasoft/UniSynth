import { types } from '@babel/core';
import { capitalize } from '../capitalize';
import { replaceSignalSetters } from './process-signals';

describe(replaceSignalSetters.name, () => {
  test('should replace signal setters', () => {
    const code = `
    props.khulnasoftContextSignal.value.content = {
      ...khulnasoftContextSignal.content,
      ...newContent,
      data: {     
        ...khulnasoftContextSignal.content?.data, 
        ...newContent?.data },
        meta: {
          ...khulnasoftContextSignal.content?.meta,
          ...newContent?.meta,
          breakpoints:
          newContent?.meta?.breakpoints ||
          khulnasoftContextSignal.content?.meta?.breakpoints,
        }
        };
        
    khulnasoftContextSignal.value.rootState = newRootState;
    `;
    const propName = 'khulnasoftContextSignal';

    const output = replaceSignalSetters({
      code,
      nodeMaps: [
        {
          from: types.memberExpression(
            types.memberExpression(types.identifier('props'), types.identifier(propName)),
            types.identifier('value'),
          ),
          setTo: types.memberExpression(
            types.identifier('props'),
            types.identifier('set' + capitalize(propName)),
          ),
        },
        {
          from: types.memberExpression(types.identifier(propName), types.identifier('value')),
          setTo: types.identifier('set' + capitalize(propName)),
        },
      ],
    });
    expect(output).toMatchSnapshot();
  });
});
