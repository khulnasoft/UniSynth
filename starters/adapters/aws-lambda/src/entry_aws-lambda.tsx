/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for Aws Lambda when building for production.
 *
 * Learn more about the Aws Lambda integration here:
 * - https://unisynth.dev/docs/deployments/aws/
 *
 */
import "source-map-support/register";
import serverless from "serverless-http";
import {
  createUnisynthCity,
  type PlatformAwsLambda,
} from "@khulnasoft.com/unisynth-city/middleware/aws-lambda";
import unisynthCityPlan from "@unisynth-city-plan";
import { manifest } from "@unisynth-client-manifest";
import render from "./entry.ssr";

declare global {
  interface UnisynthCityPlatform extends PlatformAwsLambda {}
}

export const { handle } = createUnisynthCity({ render, unisynthCityPlan, manifest });

export const unisynthApp = serverless({ handle }, { binary: true });
// handler is the default export for the lambda functions
export const handler = unisynthApp;
