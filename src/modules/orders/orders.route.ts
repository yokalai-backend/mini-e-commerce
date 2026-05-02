import { FastifyInstance } from "fastify";
import { orders, ordersList, userOrders } from "@orders/orders.controller";
import verifyTokenPlugin from "@utils/token/verify.token.plugin";

export default function ordersRoute(app: FastifyInstance) {
  app.register(verifyTokenPlugin);

  app.post("/", orders);

  app.get("/:id", userOrders);

  app.get("/list", ordersList);
}
