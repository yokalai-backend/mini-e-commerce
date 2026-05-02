import Errors from "@errors/errors";
import productsRepo from "@products/products.repository";
import {
  AddProductProps,
  productsDetailsParser,
  productDetailParser,
  ProductFilterProps,
} from "@products/products.schema";
import buildPagination from "@utils/pagination/build.pagination";

export async function productService(productId: string) {
  const res = await productsRepo.product(productId);

  if (!res) throw Errors.notFound("Product not found");

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

export async function productsByFilterService(
  {
    page,
    limit,
  }: {
    page: number;
    limit: number;
  },
  filters: ProductFilterProps,
) {
  const offset = (page - 1) * limit;

  const res = productsDetailsParser.parse(
    await productsRepo.productsByFilter({ limit, offset }, filters),
  );

  if (res.length === 0) return null;

  return res;
}

export async function addProductService(
  userId: string,
  product: AddProductProps,
) {
  return await productsRepo.addProduct(userId, product);
}

export async function productCommentsService(
  productId: string,
  { page, limit }: any,
) {
  const offset = (page - 1) * limit;

  const comments = await productsRepo.productComments(productId, {
    limit,
    offset,
  });

  const total = comments[0].total;

  const meta = buildPagination(total, page, limit);

  if (!comments) {
    return null;
  }

  return { comments, meta };
}
