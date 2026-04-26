import { FastifyRequest, FastifyReply } from "fastify";
import {
  addProductsCartService,
  addProductToCartService,
  getProductsCartService,
  getUserCartService,
  removeCartByIdService,
  removeFromCartService,
} from "@cart/cart.service";
import { AddProductsProps, GetProductsProps } from "@cart/cart.schema";

export async function getUserCart(req: FastifyRequest, rep: FastifyReply) {
  const res = await getUserCartService(req.user.id);

  return rep.ok("User's cart received successfuly", res);
} // This only occured when the user already login.

export async function getProductsCart(
  req: FastifyRequest<{ Body: GetProductsProps }>,
  rep: FastifyReply,
) {
  const res = await getProductsCartService(req.body); // Return all of the information of the products that currently in user's cart, only if user haven't login yet.

  rep.ok("User's cart received successfuly", res);
}

export async function removeCartById(
  req: FastifyRequest<{ Params: { id: string } }>,
  rep: FastifyReply,
) {
  await removeCartByIdService(req.user.id, req.params.id);

  rep.ok("Product removed from cart");
}

export async function removeFromCart(req: FastifyRequest, rep: FastifyReply) {
  await removeFromCartService(req.user.id);

  rep.ok("Cart has been cleaned up");
}

export async function addProductToCart(
  req: FastifyRequest<{
    Params: { id: string };
    Querystring: { quantity: number };
  }>,
  rep: FastifyReply,
) {
  const msgResult = await addProductToCartService({
    userId: req.user.id,
    productId: req.params.id,
    quantity: req.query.quantity,
  }); // Return the result is it updated or added to the cart, because user can't have same product in their cart instead they can modify the amount.

  rep.ok(msgResult);
}

export async function addProductsToCart(
  req: FastifyRequest<{ Body: AddProductsProps }>,
  rep: FastifyReply,
) {
  const res = await addProductsCartService(req.user.id, req.body);

  rep.ok("Successful added products to cart", res);
}
