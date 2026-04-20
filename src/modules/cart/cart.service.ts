import cartRepo from "./cart.repository";
import { AddToCart } from "@products/products.type";
import { GetProductsProps } from "./cart.schema";

export async function AddToCartService(input: AddToCart) {
  return await cartRepo.addToCart(input);
}

export async function getProductsCartService(products: GetProductsProps) {
  return await cartRepo.getProductsCart(products);
}

export async function exsName3() {
  // Code goes here
}

export async function exsName4() {
  // Code goes here
}

export async function exsName5() {
  // Code goes here
}
