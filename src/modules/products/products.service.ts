import Errors from "@errors/errors";
import productsRepo from "@products/products.repository";
import {
  AddProductProps,
  productsDetailsParser,
  productDetailParser,
} from "@products/products.schema";

export async function productService(productId: string) {
  const res = await productsRepo.product(productId);

  if (!res.id) throw Errors.notFound("Product not found");

  return productDetailParser.parse(res);
}

export async function productsService({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const offset = (page - 1) * limit;

  return productsDetailsParser.parse(
    await productsRepo.products({ limit, offset }),
  );
}

export async function addProductService(
  userId: string,
  product: AddProductProps,
) {
  return await productsRepo.addProduct(userId, product);
}
