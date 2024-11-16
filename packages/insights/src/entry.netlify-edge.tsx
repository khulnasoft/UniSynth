/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for Netlify Edge when building for production.
 *
 * Learn more about the Netlify integration here:
 * - https://unisynth.dev/docs/deployments/netlify-edge/
 *
 */
import {
  createUnisynthCity,
  type PlatformNetlify,
} from '@khulnasoft.com/unisynth-city/middleware/netlify-edge';
import unisynthCityPlan from '@unisynth-city-plan';
import render from './entry.ssr';

declare global {
  interface UnisynthCityPlatform extends PlatformNetlify {}
}

export default createUnisynthCity({ render, unisynthCityPlan });
