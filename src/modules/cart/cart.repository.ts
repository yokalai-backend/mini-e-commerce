// Don't forget to import the queries helper up here!
import { AddToCart } from "@products/products.type";
import { addToCartHelper, getCartProductsHelper } from "@repository/cart";
import { GetProductsProps } from "./cart.schema";

const cartRepo = {
  addToCart: async (input: AddToCart) => addToCartHelper(input),
  getProductsCart: async (products: GetProductsProps) =>
    getCartProductsHelper(products),
  exf3: async () => {
    // Code goes here
  },
  exf4: async () => {
    // Code goes here
  },
  exf5: async () => {
    // Code goes here
  },
};

export default cartRepo;
