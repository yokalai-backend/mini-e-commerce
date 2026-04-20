import { FastifyRequest, FastifyReply } from "fastify";
import { AddToCartService, getProductsCartService } from "./cart.service";
import { GetProductsProps } from "./cart.schema";

export async function addToCart(
  req: FastifyRequest<{
    Params: { id: string };
    Querystring: { quantity: number };
  }>,
  rep: FastifyReply,
) {
  const msgResult = await AddToCartService({
    userId: req.user.id,
    productId: req.params.id,
    quantity: req.query.quantity,
  });

  rep.ok("Product added to cart", msgResult);
}

export async function getProductsCart(
  req: FastifyRequest<{ Body: GetProductsProps }>,
  rep: FastifyReply,
) {
  const result = await getProductsCartService(req.body);

  rep.ok("Data received", result);
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
