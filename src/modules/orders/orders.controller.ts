import { FastifyRequest, FastifyReply } from "fastify";
import { ordersService } from "@orders/orders.service";

export async function orders(req: FastifyRequest, rep: FastifyReply) {
  const result = await ordersService(req.user.id);

  rep.ok("Order has been made", result);
}
