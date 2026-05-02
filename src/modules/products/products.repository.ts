import {
  addProductHelper,
  productCommentHelper,
  productHelper,
  productsByFilterHelper,
} from "@repository/products";
import { PaginationProps } from "@shared/types";
import { productsHelper } from "@repository/products";
import { AddProductProps, ProductFilterProps } from "@products/products.schema";

const productsRepo = {
  product: async (productId: string) => productHelper(productId),
  products: async (pagination: PaginationProps) => productsHelper(pagination),
  productsByFilter: async (
    pagination: PaginationProps,
    filters: ProductFilterProps,
  ) => productsByFilterHelper(pagination, filters),
  addProduct: async (userId: string, product: AddProductProps) =>
    addProductHelper(userId, product),
  productComments: async (productId: string, pagination: PaginationProps) =>
    productCommentHelper(productId, pagination),
};

export default productsRepo;
