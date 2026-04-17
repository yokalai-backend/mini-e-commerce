import {
  productsHelper,
  productHelper,
  cartHelper,
} from "@repository/products";
import { PaginationProps } from "@shared/types";
import { AddToCart } from "@products/products.type";

const productsRepo = {
  products: async (pagination: PaginationProps) => productsHelper(pagination),
  product: async (productId: string) => productHelper(productId),
  cart: async (input: AddToCart) => cartHelper(input),
};

export default productsRepo;
