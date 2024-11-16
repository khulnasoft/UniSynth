import { describe, it, expect } from 'vitest';
import { renderToString } from './render';

describe('render', () => {
  describe('unisynthPrefetchServiceWorker', () => {
    it('should render', async () => {
      const output = await renderToString(
        <>
          <head>HEAD</head>
          <body>BODY</body>
        </>,
        {
          unisynthPrefetchServiceWorker: {
            include: true,
            position: 'top',
          },
        }
      );
      expect(output.html).toContain('HEAD');
      expect(output.html).toContain('BODY');
    });
  });
});
