import { createUnisynthCity } from '@khulnasoft.com/unisynth-city/middleware/cloudflare-pages';
import unisynthCityPlan from '@unisynth-city-plan';
import render from './entry.ssr';

const fetch = createUnisynthCity({ render, unisynthCityPlan });

export { fetch };
