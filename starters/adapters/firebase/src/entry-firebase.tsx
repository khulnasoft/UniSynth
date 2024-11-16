/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for Firbease when building for production.
 *
 * Learn more about the Firebase integration here:
 * - https://unisynth.dev/docs/deployments/firebase/
 *
 */
import {
  createUnisynthCity,
  type PlatformFirebase,
} from "@khulnasoft.com/unisynth-city/middleware/firebase";
import unisynthCityPlan from "@unisynth-city-plan";
import { manifest } from "@unisynth-client-manifest";
import render from "./entry.ssr";

declare global {
  interface UnisynthCityPlatform extends PlatformFirebase {}
}

export default createUnisynthCity({ render, unisynthCityPlan, manifest });
