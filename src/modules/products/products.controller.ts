import { FastifyRequest, FastifyReply } from "fastify";
import { productsService } from "./products.service";

export async function products(
  req: FastifyRequest<{ Querystring: { page: number; limit: number } }>,
  rep: FastifyReply,
) {
  console.log("helo");
  const result = await productsService(req.query);
  console.log("je");

  rep.ok("Received product list", result);
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
