/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the Express HTTP server when building for production.
 *
 * Learn more about Node.js server integrations here:
 * - https://unisynth.dev/docs/deployments/node/
 *
 */
import { createUnisynthCity } from "@khulnasoft.com/unisynth-city/middleware/node";
import unisynthCityPlan from "@unisynth-city-plan";
import render from "./entry.ssr";
import { manifest } from "@unisynth-client-manifest";
import { createServer } from "node:http";

// Allow for dynamic port
const PORT = process.env.PORT ?? 3004;

// Create the Unisynth City express middleware
const { router, notFound, staticFile } = createUnisynthCity({
  render,
  unisynthCityPlan,
  manifest,
});

const server = createServer();

server.on("request", (req, res) => {
  staticFile(req, res, () => {
    router(req, res, () => {
      notFound(req, res, () => {});
    });
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Node server listening on http://localhost:${PORT}`);
});
