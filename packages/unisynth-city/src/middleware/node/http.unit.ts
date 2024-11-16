import { assert, test } from 'vitest';
import { normalizeUrl } from './http';

[
  {
    url: '/',
    base: 'https://unisynth.dev',
    expect: 'https://unisynth.dev/',
  },
  {
    url: '/attacker.com',
    base: 'https://unisynth.dev',
    expect: 'https://unisynth.dev/attacker.com',
  },
  {
    url: '//attacker.com',
    base: 'https://unisynth.dev',
    expect: 'https://unisynth.dev/attacker.com',
  },
  {
    url: '\\\\attacker.com',
    base: 'https://unisynth.dev',
    expect: 'https://unisynth.dev/attacker.com',
  },
  {
    url: '/some-path//attacker.com',
    base: 'https://unisynth.dev',
    expect: 'https://unisynth.dev/some-path/attacker.com',
  },
].forEach((t) => {
  test(`normalizeUrl(${t.url}, ${t.base})`, () => {
    assert.equal(normalizeUrl(t.url, t.base).href, t.expect);
  });
});
