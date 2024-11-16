import { createUnisynthCity } from "@khulnasoft.com/unisynth-city/middleware/node";
import fastifyStatic from "@fastify/static";
import unisynthCityPlan from "@unisynth-city-plan";
import type { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

import render from "../entry.ssr";

export interface FastifyUnisynthOptions {
  distDir: string;
  buildDir: string;
}

const { router, notFound } = createUnisynthCity({ render, unisynthCityPlan });

const unisynthPlugin: FastifyPluginAsync<FastifyUnisynthOptions> = async (
  fastify,
  options,
) => {
  const { buildDir, distDir } = options;

  fastify.register(fastifyStatic, {
    root: buildDir,
    prefix: "/build",
    immutable: true,
    maxAge: "1y",
    decorateReply: false,
  });

  fastify.register(fastifyStatic, {
    root: distDir,
    redirect: false,
    decorateReply: false,
  });

  fastify.setNotFoundHandler(async (request, response) => {
    await router(request.raw, response.raw, (err) => fastify.log.error(err));
    await notFound(request.raw, response.raw, (err) => fastify.log.error(err));
  });
};

export default fastifyPlugin(unisynthPlugin, { fastify: ">=4.0.0 <6.0.0" });
