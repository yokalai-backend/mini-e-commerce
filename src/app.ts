import fastify, { FastifyInstance } from "fastify";
import authRoute from "./modules/auth/auth.route";
import responseHandler from "./plugins/response.handler";
import globalErrors from "./cores/errors/global.errors";
import cookie from "fastify-cookie";
import productsRoute from "./modules/products/products.route";
import ordersRoute from "./modules/orders/orders.route";
import cartRoute from "modules/cart/cart.route";
import fastifyCors from "@fastify/cors";

export default async function buildApp() {
  const app = await fastify();

  app.register(responseHandler);
  app.register(cookie);
  app.register(fastifyCors);

  app.register(authRoute, { prefix: "/auth" });
  app.register(productsRoute, { prefix: "/products" });
  app.register(ordersRoute, { prefix: "/orders" });
  app.register(cartRoute, { prefix: "/cart" });

  app.setErrorHandler(async (error: any, req: any, rep: any) =>
    globalErrors(error, rep),
  );

  return app;
}
