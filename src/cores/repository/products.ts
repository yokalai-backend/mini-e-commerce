import { queryMany, queryOne } from "../utils/query/query";
import { PaginationProps } from "../../shared/types";
import {
  ProductDetailed,
  Products,
} from "../../modules/products/products.type";
import { ProductDetailedProps } from "../../modules/products/products.schema";

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
