/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the Deno HTTP server when building for production.
 *
 * Learn more about the Deno integration here:
 * - https://unisynth.dev/docs/deployments/deno/
 * - https://docs.deno.com/runtime/tutorials/http_server
 *
 */
import { createUnisynthCity } from "@khulnasoft.com/unisynth-city/middleware/deno";
import unisynthCityPlan from "@unisynth-city-plan";
import { manifest } from "@unisynth-client-manifest";
import render from "./entry.ssr";

// Create the Unisynth City Deno middleware
const { router, notFound, staticFile } = createUnisynthCity({
  render,
  unisynthCityPlan,
  manifest,
});

// Allow for dynamic port
const port = Number(Deno.env.get("PORT") ?? 3009);

/* eslint-disable */
console.log(`Server starter: http://localhost:${port}/app/`);

Deno.serve({ port }, async (request: Request, info: any) => {
  const staticResponse = await staticFile(request);
  if (staticResponse) {
    return staticResponse;
  }

  // Server-side render this request with Unisynth City
  const unisynthCityResponse = await router(request, info);
  if (unisynthCityResponse) {
    return unisynthCityResponse;
  }

  // Path not found
  return notFound(request);
});

declare const Deno: any;
