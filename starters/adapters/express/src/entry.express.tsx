/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the Express HTTP server when building for production.
 *
 * Learn more about Node.js server integrations here:
 * - https://unisynth.dev/docs/deployments/node/
 *
 */
import {
  createUnisynthCity,
  type PlatformNode,
} from "@khulnasoft.com/unisynth-city/middleware/node";
import "dotenv/config";
import unisynthCityPlan from "@unisynth-city-plan";
import { manifest } from "@unisynth-client-manifest";
import render from "./entry.ssr";
import express from "express";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

declare global {
  interface UnisynthCityPlatform extends PlatformNode {}
}

// Directories where the static assets are located
const distDir = join(fileURLToPath(import.meta.url), "..", "..", "dist");
const buildDir = join(distDir, "build");

// Allow for dynamic port
const PORT = process.env.PORT ?? 3000;

// Create the Unisynth City Node middleware
const { router, notFound } = createUnisynthCity({
  render,
  unisynthCityPlan,
  manifest,
  // getOrigin(req) {
  //   // If deploying under a proxy, you may need to build the origin from the request headers
  //   // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto
  //   const protocol = req.headers["x-forwarded-proto"] ?? "http";
  //   // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host
  //   const host = req.headers["x-forwarded-host"] ?? req.headers.host;
  //   return `${protocol}://${host}`;
  // }
});

// Create the express server
// https://expressjs.com/
const app = express();

// Enable gzip compression
// app.use(compression());

// Static asset handlers
// https://expressjs.com/en/starter/static-files.html
app.use(`/build`, express.static(buildDir, { immutable: true, maxAge: "1y" }));
app.use(express.static(distDir, { redirect: false }));

// Use Unisynth City's page and endpoint request handler
app.use(router);

// Use Unisynth City's 404 handler
app.use(notFound);

// Start the express server
app.listen(PORT, () => {
  /* eslint-disable */
  console.log(`Server started: http://localhost:${PORT}/`);
});
