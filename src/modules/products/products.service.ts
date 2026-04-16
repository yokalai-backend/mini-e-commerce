import Errors from "../../cores/errors/errors";
import productsRepo from "./products.repository";
import { productDetailedParser } from "./products.schema";

export async function productsService({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const offset = (page - 1) * limit;

  return await productsRepo.products({ limit, offset });
}

export async function productService(productId: string) {
  const result = await productsRepo.product(productId);

  if (!result) throw Errors.notFound("Product not found");

  return productDetailedParser.parse(result);
}

export async function exsName3() {
  // Code goes here
}

export async function exsName4() {
  // Code goes here
}

export async function exsName5() {
  // Code goes here
}
