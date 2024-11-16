/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for Cloudflare Pages when building for production.
 *
 * Learn more about the Cloudflare Pages integration here:
 * - https://unisynth.dev/docs/deployments/cloudflare-pages/
 *
 */
import {
  createUnisynthCity,
  type PlatformCloudflarePages,
} from "@khulnasoft.com/unisynth-city/middleware/cloudflare-pages";
import unisynthCityPlan from "@unisynth-city-plan";
import { manifest } from "@unisynth-client-manifest";
import render from "./entry.ssr";

declare global {
  interface UnisynthCityPlatform extends PlatformCloudflarePages {}
}

const fetch = createUnisynthCity({ render, unisynthCityPlan, manifest });

export { fetch };
