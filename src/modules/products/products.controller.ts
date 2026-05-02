import { FastifyRequest, FastifyReply } from "fastify";
import {
  addProductService,
  productCommentsService,
  productsByFilterService,
  productService,
  productsService,
} from "@products/products.service";
import { AddProductProps, ProductFilterProps } from "@products/products.schema";
import { ProductCategories } from "./products.type";

export async function product(
  req: FastifyRequest<{
    Params: { id: string };
  }>,
  rep: FastifyReply,
) {
  const res = await productService(req.params.id);

  rep.ok("Received product information", res);
} // Get one product information.

export async function products(
  req: FastifyRequest<{
    Querystring: { page: number; limit: number };
  }>,
  rep: FastifyReply,
) {
  const res = await productsService(req.query);

  rep.ok("Received product list", res);
} // Get entire products limited by pagination.

export async function productsByFilter(
  req: FastifyRequest<{
    Querystring: { page: number; limit: number };
    Body: ProductFilterProps;
  }>,
  rep: FastifyReply,
) {
  const res = await productsByFilterService(req.query, req.body);

  rep.ok("Received filtered product list", res);
} // Get entire products limited by pagination and filter.

export async function addProduct(
  req: FastifyRequest<{ Body: AddProductProps }>,
  rep: FastifyReply,
) {
  const res = await addProductService(req.user.id, req.body);

  rep.ok(res.message, res.formatted);
} // User can add their own product to sell, great help for me debugging lol.

export async function productComments(
  req: FastifyRequest<{
    Params: { id: string };
    Body: { pagination: { page: number; limit: number } };
  }>,
  rep: FastifyReply,
) {
  const res = await productCommentsService(req.params.id, req.query);

  rep.ok("Comments received", res);
}
