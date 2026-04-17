import { queryMany, queryOne } from "../utils/query/query";
import { PaginationProps } from "../../shared/types";
import {
  AddToCart,
  ProductDetailed,
  Products,
} from "../../modules/products/products.type";
import { ProductDetailedProps } from "../../modules/products/products.schema";
import Errors from "../errors/errors";
import pool from "../config/db";

export async function productsHelper({ limit, offset }: PaginationProps) {
  return await queryMany<Products>(
    `SELECT id, name, price, stock, description FROM products WHERE is_sold = false ORDER BY created_at ASC LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
}

export async function productHelper(productId: string) {
  const result = await queryOne<ProductDetailedProps>(
    `
    SELECT u.id AS owner_id, u.username AS owner_name, p.id AS product_id, p.name AS product_name, p.price, p.stock, p.description, 
    pd.category, pd.send_from, pd.rating, pd.total_solds FROM users u LEFT JOIN
    products p ON u.id = p.user_id LEFT JOIN product_details pd ON pd.product_id = p.id
    WHERE u.is_active = true AND p.is_sold = false AND p.id = $1
    `,
    [productId],
  );

  return result;
}

export async function cartHelper({ userId, productId, quantity }: AddToCart) {
  const { price, stock } = await queryOne<{ price: number; stock: number }>(
    `SELECT price, stock FROM products WHERE id = $1 AND is_sold = false`,
    [productId],
  );

  if (!price) throw Errors.notFound("Product not found");

  if (quantity > stock)
    throw Errors.badRequest("Stock not enough", "INSUFFICIENT_STOCK");

  const totalPrice = price * quantity;

  const result = await queryOne<{ inserted: boolean }>(
    `INSERT INTO user_cart (user_id, product_id, quantity, total_price) VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity, total_price = EXCLUDED.total_price, updated_at = NOW() 
    RETURNING id, (xmax = 0) AS inserted`,
    [userId, productId, quantity, totalPrice],
  );

  if (result.inserted) {
    return "Product added to cart";
  } else {
    return "Cart updated";
  }
}

export async function cancelCartHelper() {}
