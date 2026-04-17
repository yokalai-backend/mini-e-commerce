// Don't forget to import the queries helper up here!

import {
  productsHelper,
  productHelper,
  cartHelper,
} from "../../cores/repository/products";
import { PaginationProps } from "../../shared/types";
import { AddToCart } from "./products.type";

const productsRepo = {
  products: async (pagination: PaginationProps) => productsHelper(pagination),
  product: async (productId: string) => productHelper(productId),
  cart: async (input: AddToCart) => cartHelper(input),
  exf4: async () => {
    // Code goes here
  },
  exf5: async () => {
    // Code goes here
  },
};

export default productsRepo;
