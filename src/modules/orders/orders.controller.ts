import { FastifyRequest, FastifyReply } from "fastify";
import { ordersService } from "./orders.service";

export async function orders(req: FastifyRequest, rep: FastifyReply) {
  const result = await ordersService(req.user.id);
}

export async function excName2(req: FastifyRequest, rep: FastifyReply) {
  // Code goes here
}

export async function excName3(req: FastifyRequest, rep: FastifyReply) {
  // Code goes here
}

export async function excName4(req: FastifyRequest, rep: FastifyReply) {
  // Code goes here
}

export async function excName5(req: FastifyRequest, rep: FastifyReply) {
  // Code goes here
}
