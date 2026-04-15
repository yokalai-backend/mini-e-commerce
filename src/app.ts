import fastify, { FastifyInstance } from "fastify";

export default async function buildApp() {
  const app = await fastify();

  return app;
}
