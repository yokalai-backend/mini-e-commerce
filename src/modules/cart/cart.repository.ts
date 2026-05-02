// Don't forget to import the queries helper up here!
import { AddToCartProps } from "@products/products.type";
import {
  addProductsToCartHelper,
  addProductToCartHelper,
  getCartProductsHelper,
  mergeUserCartHelper,
  removeCartByIdHelper,
  removeFromCartHelper,
} from "@repository/cart";
import { AddProductsProps, GetProductsProps } from "@cart/cart.schema";

const cartRepo = {
  getProductsCart: async (products: GetProductsProps) =>
    getCartProductsHelper(products),

  removeCartById: async (userId: string, productId: string) =>
    removeCartByIdHelper(userId, productId),

  removeFromCart: async (userId: string) => removeFromCartHelper(userId),
  addProductToCart: async (input: AddToCartProps) =>
    addProductToCartHelper(input),

  addProductsToCart: async (userId: string, products: AddProductsProps) =>
    addProductsToCartHelper(userId, products),

  mergeUserCart: async (userId: string, localCart: GetProductsProps) =>
    mergeUserCartHelper(userId, localCart),
};

export default cartRepo;
