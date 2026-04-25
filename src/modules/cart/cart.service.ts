import cartRepo from "@cart/cart.repository";
import { AddToCart } from "@products/products.type";
import { AddProductsProps, GetProductsProps } from "@cart/cart.schema";

export async function getProductsCartService(products: GetProductsProps) {
  return await cartRepo.getProductsCart(products);
}

export async function addProductToCartService(input: AddToCart) {
  return await cartRepo.addProductToCart(input);
}

export async function addProductsCartService(
  userId: string,
  products: AddProductsProps,
) {
  return await cartRepo.addProductsToCart(userId, products);
}

export async function exsName4() {
  // Code goes here
}

export async function exsName5() {
  // Code goes here
}
