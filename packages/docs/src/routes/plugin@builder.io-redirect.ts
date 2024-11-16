import type { RequestHandler } from '@khulnasoft.com/unisynth-city/middleware/request-handler';

/**
 * @file
 *
 *   Redirects requests from Builder.io to the unisynth.dev domain.
 *
 *   This redirect has been placed here because of security vulnerabilities on the builder.io domain.
 *
 *   # Issue
 *
 *   - Because of Unisynth REPL is is possible to write arbitrary code that runs on a builder.io
 *       subdomain with unisynth.dev/repl
 *   - This opens vulnerabilities around XSS, cookie jacking, because builder.io uses cross-subdomain
 *       cookies
 *
 *   # Solution
 *
 *   - Move the unisynth.dev/repl of the unisynth.dev domain to the unisynth.dev domain.
 *   - Place a 308 redirect here to ensure that all requests to the builder.io domain are redirected to
 *       the unisynth.dev domain.
 */

export const onRequest: RequestHandler = ({ request, redirect }) => {
  const url = new URL(request.url);
  if (url.hostname === 'unisynth.builder.io') {
    // Redirect to the Builder.io plugin
    url.hostname = 'unisynth.dev';
    const pathname = url.pathname;
    if (pathname.startsWith('/repl/')) {
      // Prevent anything from /repl/ from being redirected so that we don't accidentally serve a script tag.
      url.pathname = '';
    }
    throw redirect(308, url.toString());
  }
};
