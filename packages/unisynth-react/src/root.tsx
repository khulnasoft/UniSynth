import { component$ } from '@khulnasoft.com/unisynth';
import { App } from './examples/app';

export const Root = component$(() => {
  return (
    <>
      <head>
        <meta charset="utf-8" />
        <title>Unisynth Blank App</title>
        <style>
          {`
            box {
              display: block;
              width: 200px;
              height: 200px;
              margin: 20px;
              background: blue;
            }
          `}
        </style>
      </head>
      <body>
        <box />
        <box />
        <box />
        <box />
        <box />
        <box />
        <box />
        <box />
        <box />
        <box />
        <box />
        <App client:visible />
      </body>
    </>
  );
});
