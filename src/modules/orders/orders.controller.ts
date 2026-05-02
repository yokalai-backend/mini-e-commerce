import { FastifyRequest, FastifyReply } from "fastify";
import {
  ordersListService,
  ordersService,
  userOrdersService,
} from "@orders/orders.service";

export async function orders(req: FastifyRequest, rep: FastifyReply) {
  const res = await ordersService(req.user.id);

  rep.ok("Order has been made", res);
}

export async function userOrders(
  req: FastifyRequest<{ Params: { id: string } }>,
  rep: FastifyReply,
) {
  const res = await userOrdersService(req.user.id, req.params.id);

  rep.ok("User's orders received", res);
}

export async function ordersList(req: FastifyRequest, rep: FastifyReply) {
  const res = await ordersListService(req.user.id);

  rep.ok("User orders list received", res);
}
