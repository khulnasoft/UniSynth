/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the Fastify server when building for production.
 *
 * Learn more about Node.js server integrations here:
 * - https://unisynth.dev/docs/deployments/node/
 *
 */
import { type PlatformNode } from "@khulnasoft.com/unisynth-city/middleware/node";
import "dotenv/config";
import Fastify from "fastify";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import FastifyUnisynth from "./plugins/fastify-unisynth";

declare global {
  interface UnisynthCityPlatform extends PlatformNode {}
}

// Directories where the static assets are located
const distDir = join(fileURLToPath(import.meta.url), "..", "..", "dist");
const buildDir = join(distDir, "build");

// Allow for dynamic port and host
const PORT = parseInt(process.env.PORT ?? "3000");
const HOST = process.env.HOST ?? "0.0.0.0";

const start = async () => {
  // Create the fastify server
  // https://fastify.dev/docs/latest/Guides/Getting-Started/
  const fastify = Fastify({
    logger: true,
  });

  // Enable compression
  // https://github.com/fastify/fastify-compress
  // IMPORTANT NOTE: THIS MUST BE REGISTERED BEFORE THE fastify-unisynth PLUGIN
  // await fastify.register(import('@fastify/compress'))

  // Handle Unisynth City using a plugin
  await fastify.register(FastifyUnisynth, { distDir, buildDir });

  // Start the fastify server
  await fastify.listen({ port: PORT, host: HOST });
};

start();
