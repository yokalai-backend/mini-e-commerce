import cartRepo from "@cart/cart.repository";
import { AddToCartProps } from "@products/products.type";
import { AddProductsProps, GetProductsProps } from "@cart/cart.schema";

export async function getUserCartService(userId: string) {
  return await cartRepo.getUserCart(userId);
}
export async function getProductsCartService(products: GetProductsProps) {
  return await cartRepo.getProductsCart(products);
}

export async function addProductToCartService(input: AddToCartProps) {
  return await cartRepo.addProductToCart(input);
}

export async function addProductsCartService(
  userId: string,
  products: AddProductsProps,
) {
  return await cartRepo.addProductsToCart(userId, products);
}
