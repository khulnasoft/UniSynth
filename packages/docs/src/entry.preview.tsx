import { createUnisynthCity } from '@khulnasoft.com/unisynth-city/middleware/node';
import unisynthCityPlan from '@unisynth-city-plan';
import render from './entry.ssr';

/** The default export is the UnisynthCity adapter used by Vite preview. */
export default createUnisynthCity({ render, unisynthCityPlan });
