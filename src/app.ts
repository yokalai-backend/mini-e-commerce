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
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "path";

export default async function buildApp() {
  const app = fastify();

  app.register(fastifyCors, {
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning", // ← ini yang kurang
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    origin: [
      "http://192.168.1.9:3000",
      "http://localhost:3000",
      "https://myfirstminiecommercefrontendpart.vercel.app",
    ],
  });

  app.addHook("onRequest", async (req) => {
    console.log("REQ:", req.method, req.url);
  });

  app.register(responseHandler);
  app.register(cookie);

  app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });

  app.register(fastifyStatic, {
    root: path.join(process.cwd(), "uploads"),
    prefix: "/uploads/",
    setHeaders(res) {
      res.setHeader(
        "Access-Control-Allow-Origin",
        "https://myfirstminiecommercefrontendpart.vercel.app",
      );
    },
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
