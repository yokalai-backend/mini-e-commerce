import fastify from "fastify";
import authRoute from "@auth/auth.route";
import responseHandler from "@plugins/response.handler";
import globalErrors from "@errors/global.errors";
import cookie from "@fastify/cookie";
import productsRoute from "@products/products.route";
import ordersRoute from "@orders/orders.route";
import cartRoute from "@cart/cart.route";
import fastifyCors from "@fastify/cors";
import userRoute from "@user/user.route";

export default async function buildApp() {
  const app = fastify();

  app.register(responseHandler);
  app.register(cookie);
  app.register(fastifyCors, {
    credentials: true,
    origin: "http://localhost:3000",
    methods: ["DELETE", "POST", "GET", "UPDATE"],
  });

  app.register(authRoute, { prefix: "/auth" });
  app.register(productsRoute, { prefix: "/products" });
  app.register(ordersRoute, { prefix: "/orders" });
  app.register(cartRoute, { prefix: "/cart" });
  app.register(userRoute, { prefix: "/user" });

  app.setErrorHandler(async (error: any, req: any, rep: any) =>
    globalErrors(error, rep),
  );

  return app;
}
