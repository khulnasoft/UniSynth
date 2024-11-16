import { routeAction$, routeLoader$ } from '@khulnasoft.com/unisynth-city';

export const useCommonRouteAction = routeAction$(async () => {
  // ...
  return { success: true, data: ['Unisynth', 'Partytown'] };
});

export const useCommonRouteLoader = routeLoader$(async () => {
  // ...
  return ['Mitosis', 'Builder.io'];
});
