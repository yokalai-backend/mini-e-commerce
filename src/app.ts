import fastify, { FastifyInstance } from "fastify";
import authRoute from "./modules/auth/auth.route";
import responseHandler from "./plugins/response.handler";
import globalErrors from "./cores/errors/global.errors";

export default async function buildApp() {
  const app = await fastify();

  app.register(responseHandler);

  app.register(authRoute, { prefix: "/auth" });

  app.setErrorHandler(async (error: any, req: any, rep: any) =>
    globalErrors(error, rep),
  );

  return app;
}
