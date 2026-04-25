import { FastifyRequest, FastifyReply } from "fastify";
import {
  addProductService,
  productService,
  productsService,
} from "@products/products.service";
import { AddProductProps } from "@products/products.schema";

export async function product(
  req: FastifyRequest<{ Params: { id: string } }>,
  rep: FastifyReply,
) {
  const res = await productService(req.params.id);

  rep.ok("Received product", res);
} // Get one product information.

export async function products(
  req: FastifyRequest<{ Querystring: { page: number; limit: number } }>,
  rep: FastifyReply,
) {
  const res = await productsService(req.query);

  rep.ok("Received product list", res);
} // Get entire products limited by pagination.

export async function addProduct(
  req: FastifyRequest<{ Body: AddProductProps }>,
  rep: FastifyReply,
) {
  const res = await addProductService(req.user.id, req.body);

  rep.ok(res);
} // User can add their own product to sell, great help for me debugging lol.
