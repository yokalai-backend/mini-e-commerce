import { productHelper } from "@repository/products";
import { PaginationProps } from "@shared/types";
import { productsHelper } from "@repository/products";

const productsRepo = {
  products: async (pagination: PaginationProps) => productsHelper(pagination),
  product: async (productId: string) => productHelper(productId),
};

export default productsRepo;
