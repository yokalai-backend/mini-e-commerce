import { queryMany, queryOne } from "../utils/query/query";
import { PaginationProps } from "../../shared/types";
import { AddToCart } from "../../modules/products/products.type";
import { ProductDetailedProps } from "../../modules/products/products.schema";
import Errors from "../errors/errors";
import { Products } from "../../modules/products/products.type";

export async function productsHelper({ limit, offset }: PaginationProps) {
  return await queryMany<Products>(
    `SELECT u.id AS owner_id, u.username AS owner_name, p.id AS product_id, p.name AS product_name, p.price, p.stock, p.image,
    pd.category, pd.send_from, pd.rating, pd.total_solds FROM users u INNER JOIN products p ON u.id = p.user_id INNER JOIN
    product_details pd ON pd.product_id = p.id WHERE p.is_sold = false AND u.is_active = true ORDER BY pd.rating DESC LIMIT $1 OFFSET $2`,
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

export async function cancelCartHelper() {}
