import { FastifyRequest, FastifyReply } from "fastify";
import { productService, productsService } from "./products.service";

export async function products(
  req: FastifyRequest<{ Querystring: { page: number; limit: number } }>,
  rep: FastifyReply,
) {
  const result = await productsService(req.query);

  rep.ok("Received product list", result);
}

export async function product(
  req: FastifyRequest<{ Params: { id: string } }>,
  rep: FastifyReply,
) {
  const result = await productService(req.params.id);

  rep.ok("Received product", result);
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
