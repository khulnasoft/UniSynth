/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for Vercel Edge when building for production.
 *
 * Learn more about the Vercel Edge integration here:
 * - https://unisynth.dev/docs/deployments/vercel-edge/
 *
 */
import {
  createUnisynthCity,
  type PlatformVercel,
} from "@khulnasoft.com/unisynth-city/middleware/vercel-edge";
import unisynthCityPlan from "@unisynth-city-plan";
import { manifest } from "@unisynth-client-manifest";
import render from "./entry.ssr";

declare global {
  interface UnisynthCityPlatform extends PlatformVercel {}
}

export default createUnisynthCity({ render, unisynthCityPlan, manifest });
