/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the Azure Static Web Apps middleware when building for production.
 *
 * Learn more about the Azure Static Web Apps integration here:
 * - https://unisynth.dev/docs/deployments/azure-swa/
 *
 */
import {
  createUnisynthCity,
  type PlatformAzure,
} from "@khulnasoft.com/unisynth-city/middleware/azure-swa";
import unisynthCityPlan from "@unisynth-city-plan";
import { manifest } from "@unisynth-client-manifest";
import render from "./entry.ssr";

declare global {
  interface UnisynthCityPlatform extends PlatformAzure {}
}

export default createUnisynthCity({ render, unisynthCityPlan, manifest });
