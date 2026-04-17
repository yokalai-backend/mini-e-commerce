import { FastifyInstance } from "fastify";
import { orders } from "./orders.controller";
import verifyToken from "../../cores/utils/token/verify.token";

export default function ordersRoute(app: FastifyInstance) {
  app.register(verifyToken);

  app.post("/", orders);

  app.post("/ex", () => console.log("Example"));

  app.delete("/ex", () => console.log("Example"));

  app.patch("/ex", () => console.log("Example"));

  app.put("/ex", () => console.log("Example"));
}
