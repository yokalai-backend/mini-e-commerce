import { FastifyInstance } from "fastify";
import {
  orders,
  ordersList,
  userOrderItems,
  userOrders,
} from "@orders/orders.controller";
import verifyTokenPlugin from "@utils/token/verify.token.plugin";
import validateParams from "@utils/preValidation/validate.params";
import { productIdSchema } from "@products/products.schema";

export default function ordersRoute(app: FastifyInstance) {
  app.register(verifyTokenPlugin);

  app.post("/", orders);

  app.get("/:id", userOrders);

  app.get("/list", ordersList);

  app.get(
    "/exists/:id",
    { preValidation: validateParams(productIdSchema) },
    userOrderItems,
  );
}
