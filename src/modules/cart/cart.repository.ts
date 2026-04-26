// Don't forget to import the queries helper up here!
import { AddToCartProps } from "@products/products.type";
import {
  addProductsToCartHelper,
  addProductToCartHelper,
  getCartProductsHelper,
  getUserCartHelper,
} from "@repository/cart";
import { AddProductsProps, GetProductsProps } from "@cart/cart.schema";

const cartRepo = {
  getUserCart: async (userId: string) => getUserCartHelper(userId),
  getProductsCart: async (products: GetProductsProps) =>
    getCartProductsHelper(products),
  addProductToCart: async (input: AddToCartProps) =>
    addProductToCartHelper(input),
  addProductsToCart: async (userId: string, products: AddProductsProps) =>
    addProductsToCartHelper(userId, products),
  exf4: async () => {
    // Code goes here
  },
  exf5: async () => {
    // Code goes here
  },
};

export default cartRepo;
