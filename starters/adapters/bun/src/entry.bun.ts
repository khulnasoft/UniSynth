/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the Bun HTTP server when building for production.
 *
 * Learn more about the Bun integration here:
 * - https://unisynth.dev/docs/deployments/bun/
 * - https://bun.sh/docs/api/http
 *
 */
import { createUnisynthCity } from "@khulnasoft.com/unisynth-city/middleware/bun";
import unisynthCityPlan from "@unisynth-city-plan";
import { manifest } from "@unisynth-client-manifest";
import render from "./entry.ssr";

// Create the Unisynth City Bun middleware
const { router, notFound, staticFile } = createUnisynthCity({
  render,
  unisynthCityPlan,
  manifest,
});

// Allow for dynamic port
const port = Number(Bun.env.PORT ?? 3000);

// eslint-disable-next-line no-console
console.log(`Server started: http://localhost:${port}/`);

Bun.serve({
  async fetch(request: Request) {
    const staticResponse = await staticFile(request);
    if (staticResponse) {
      return staticResponse;
    }

    // Server-side render this request with Unisynth City
    const unisynthCityResponse = await router(request);
    if (unisynthCityResponse) {
      return unisynthCityResponse;
    }

    // Path not found
    return notFound(request);
  },
  port,
});
