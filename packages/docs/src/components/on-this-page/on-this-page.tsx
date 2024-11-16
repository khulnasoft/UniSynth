import { useContent, useLocation } from '@khulnasoft.com/unisynth-city';
import { component$, useContext, $, useStyles$, useOnDocument, useSignal } from '@khulnasoft.com/unisynth';
import { ChatIcon } from '../svgs/chat-icon';
import { GithubLogo } from '../svgs/github-logo';
import { TwitterLogo } from '../svgs/twitter-logo';
import styles from './on-this-page.css?inline';
import { EditIcon } from '../svgs/edit-icon';
import { GlobalStore } from '../../context';
import { AlertIcon } from '../svgs/alert-icon';

const UNISYNTH_GROUP = [
  'components',
  'concepts',
  'faq',
  'getting-started',
  'think-unisynth',
  'deprecated-features',
];

const UNISYNTH_ADVANCED_GROUP = [
  'containers',
  'custom-build-dir',
  'dollar',
  'eslint',
  'library',
  'optimizer',
  'modules-prefetching',
  'qrl',
  'unisynthloader',
  'vite',
];

const UNISYNTHCITY_GROUP = [
  'action',
  'api',
  'caching',
  'endpoints',
  'env-variables',
  'guides',
  'html-attributes',
  'layout',
  'middleware',
  'pages',
  'project-structure',
  'unisynthcity',
  'route-loader',
  'routing',
  'server$',
  'troubleshooting',
  'validator',
];
const UNISYNTHCITY_ADVANCED_GROUP = [
  'content-security-policy',
  'menu',
  'request-handling',
  'routing',
  'sitemaps',
  'speculative-module-fetching',
  'static-assets',
];

const makeEditPageUrl = (url: string): string => {
  const segments = url.split('/').filter((part) => part !== '');
  if (segments[0] !== 'docs') {
    return url;
  }
  let group = '';
  if (segments[1] == 'advanced') {
    if (UNISYNTH_ADVANCED_GROUP.includes(segments[2])) {
      group = '(unisynth)';
    } else if (UNISYNTHCITY_ADVANCED_GROUP.includes(segments[2])) {
      group = '(unisynthcity)';
    }
  } else if (UNISYNTH_GROUP.includes(segments[1])) {
    group = '(unisynth)';
  } else if (UNISYNTHCITY_GROUP.includes(segments[1])) {
    group = '(unisynthcity)';
  }

  if (group) {
    segments.splice(1, 0, group);
  }

  return segments.join('/');
};

export const OnThisPage = component$(() => {
  useStyles$(styles);
  const theme = useContext(GlobalStore);
  const { headings } = useContent();
  const contentHeadings = headings?.filter((h) => h.level <= 3) || [];

  const { url } = useLocation();

  const githubEditRoute = makeEditPageUrl(url.pathname);

  const editUrl = `https://github.com/khulnasoft/unisynth/edit/main/packages/docs/src/routes/${githubEditRoute}/index.mdx`;

  const OnThisPageMore = [
    {
      href: editUrl,
      text: 'Edit this Page',
      icon: EditIcon,
    },
    {
      href: 'https://github.com/khulnasoft/unisynth/issues/new/choose',
      text: 'Create an issue',
      icon: AlertIcon,
    },
    {
      href: 'https://unisynth.dev/chat',
      text: 'Join our community',
      icon: ChatIcon,
    },
    {
      href: 'https://github.com/khulnasoft/unisynth',
      text: 'GitHub',
      icon: GithubLogo,
    },
    {
      href: 'https://twitter.com/khulnasoft',
      text: '@khulnasoft',
      icon: TwitterLogo,
    },
  ];

  const useActiveItem = (itemIds: string[]) => {
    const activeId = useSignal<string | null>(null);
    useOnDocument(
      'scroll',
      $(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                activeId.value = entry.target.id;
              }
            });
          },
          { rootMargin: '0% 0% -80% 0%' }
        );

        itemIds.forEach((id) => {
          const element = document.getElementById(id);
          if (element) {
            observer.observe(element);
          }
        });

        return () => {
          itemIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
              observer.unobserve(element);
            }
          });
        };
      })
    );

    return activeId;
  };

  const activeId = useActiveItem(contentHeadings.map((h) => h.id));

  return (
    <aside class="on-this-page text-sm overflow-y-auto hidden xl:block">
      {contentHeadings.length > 0 ? (
        <>
          <h6>On This Page</h6>
          <ul class="px-2 font-medium text-[var(--interactive-text-color)]">
            {contentHeadings.map((h) => (
              <li
                key={h.id}
                class={`${
                  theme.theme === 'light'
                    ? 'hover:bg-[var(--unisynth-light-blue)]'
                    : 'hover:bg-[var(--on-this-page-hover-bg-color)]'
                }`}
              >
                {activeId.value === h.id ? (
                  <span class="on-this-page-item">{h.text}</span>
                ) : (
                  <a href={`#${h.id}`} class={`${h.level > 2 ? 'ml-0' : null} on-this-page-item`}>
                    {h.text}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <h6>More</h6>
      <ul class="px-2 font-medium text-[var(--interactive-text-color)]">
        {OnThisPageMore.map((el, index) => {
          return (
            <li
              class={`${
                theme.theme === 'light'
                  ? 'hover:bg-[var(--unisynth-light-blue)]'
                  : 'hover:bg-[var(--on-this-page-hover-bg-color)]'
              } rounded-lg`}
              key={`more-items-on-this-page-${index}`}
            >
              <a class="more-item" href={el.href} rel="noopener" target="_blank">
                <el.icon width={20} height={20} />
                <span>{el.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
});