import Errors from "@errors/errors";
import { queryMany, queryOne } from "@utils/query/query";
import { AddToCartProps, ProductsProps } from "@products/products.type";
import {
  AddProductsProps,
  CartProductSchema,
  GetProductsProps,
} from "@cart/cart.schema";
import { DatabaseError } from "pg";

export async function getUserCartHelper(userId: string) {
  const products = await queryMany<GetProductsProps>(
    `SELECT * FROM user_cart WHERE user_id = $1`,
    [userId],
  );

  const productsList = products.reduce((acc: any, e: any) => {
    const key = e.product_id;

    if (!acc[key]) acc[key] = e.quantity;

    return acc;
  }, {});

  const productsId = products.map((e: any) => e.product_id); // Getting all the products id.

  const productsInformation = await queryMany<ProductsProps>(
    `SELECT id, name, price, stock, image FROM products
WHERE id = ANY($1::uuid[])`,
    [productsId],
  ); // Get all the product based on their ids.

  console.log(productsInformation);

  const res = productsInformation.map((e) =>
    productsList[e.id] ? { ...e, amount: productsList[e.id] } : e,
  );

  console.log(res);

  return res;
}

export async function getCartProductsHelper(products: GetProductsProps) {
  const productsList = products.reduce((acc: any, e: any) => {
    const key = e.id;

    if (!acc[key]) acc[key] = e.amount;

    return acc;
  }, {});

  const productsId = products.map((e: any) => e.id);

  const productsInformation = await queryMany<ProductsProps>(
    `SELECT id, name, price, stock, image FROM products
WHERE id = ANY($1::uuid[])`,
    [productsId],
  );

  const res = productsInformation.map((e) =>
    productsList[e.id] ? { ...e, amount: productsList[e.id] } : e,
  );

  return res;
}

export async function addProductToCartHelper({
  userId,
  productId,
  quantity,
}: AddToCartProps) {
  const { price, stock } = await queryOne<{ price: number; stock: number }>(
    `SELECT price, stock FROM products WHERE id = $1 AND is_sold = false`,
    [productId],
  ); // Check if the product price and stock is valid, we don't have to worry about the race condition for now since it will cost more connection also it could be redundant, so here I just do core check, I will do the real check when user ordering later.

  if (!price) throw Errors.notFound("Product not found");

  if (quantity > stock)
    throw Errors.badRequest("Stock does not enough", "INSUFFICIENT_STOCK");

  const result = await queryOne<{ inserted: boolean }>(
    `INSERT INTO user_cart (user_id, product_id, quantity) VALUES ($1, $2, $3)
    ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = NOW() 
    RETURNING id, (xmax = 0) AS inserted`,
    [userId, productId, quantity],
  ); // I choose upsert because i want it to be efficient, if the user already has the product in the cart instead of adding another same product we do update instead.

  if (result.inserted) {
    return "Product added to cart";
  } else {
    return "Cart updated";
  }
}

// This function activate when user has more than 1 product inside their cart, or when user open their cart page then this function will be called.
export async function addProductsToCartHelper(
  userId: string,
  products: AddProductsProps,
) {
  const values: string[] = [];
  const params: any[] = [userId];

  let index = 2; // Because we push 2 values we need index of two so it could jump 2 index each time to adding another different values.

  for (const item of products) {
    values.push(`($1, $${index}, $${index + 1})`);
    params.push(item.id, item.amount);
    index += 2;
  }

  try {
    await queryMany<CartProductSchema>(
      `
      INSERT INTO user_cart (user_id, product_id, quantity)
      VALUES ${values.join(", ")}
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET 
        quantity = EXCLUDED.quantity,
        updated_at = NOW()
      RETURNING id, (xmax = 0) AS inserted
      `,
      params,
    ); // Because this is crucial we need to check if each product exists or not, we don't know if the owner already remove it's product so we need to check if it's still exists.
  } catch (error) {
    if (error instanceof DatabaseError) {
      if (error.code === "23503") {
        throw Errors.notFound("Products not found");
      }
    }

    throw error;
  }
}
