import { addProductHelper, productHelper } from "@repository/products";
import { PaginationProps } from "@shared/types";
import { productsHelper } from "@repository/products";
import { AddProductProps } from "@products/products.schema";

const productsRepo = {
  product: async (productId: string) => productHelper(productId),
  products: async (pagination: PaginationProps) => productsHelper(pagination),
  addProduct: async (userId: string, product: AddProductProps) =>
    addProductHelper(userId, product),
};

export default productsRepo;
