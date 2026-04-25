import { FastifyInstance } from "fastify";
import { orders } from "@orders/orders.controller";
import verifyTokenPlugin from "@utils/token/verify.token.plugin";

export default function ordersRoute(app: FastifyInstance) {
  app.register(verifyTokenPlugin);

  app.post("/", orders);
}
