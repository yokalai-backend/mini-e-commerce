import cartRepo from "@cart/cart.repository";
import { AddToCartProps } from "@products/products.type";
import { AddProductsProps, GetProductsProps } from "@cart/cart.schema";
import Errors from "@errors/errors";

export async function getProductsCartService(products: GetProductsProps) {
  return await cartRepo.getProductsCart(products);
}

export async function removeCartByIdService(userId: string, productId: string) {
  const res = await cartRepo.removeCartById(userId, productId);

  if (!res) throw Errors.notFound("Product not found");
}

export async function removeFromCartService(userId: string) {
  await cartRepo.removeFromCart(userId);
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

export async function mergeUserCartService(
  userId: string,
  localCart: GetProductsProps,
) {
  return await cartRepo.mergeUserCart(userId, localCart);
}
