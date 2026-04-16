import { queryMany } from "../utils/query/query";
import { PaginationProps } from "../../shared/types";
import { Products } from "../../modules/products/products.type";

export async function productsHelper({ limit, offset }: PaginationProps) {
  return await queryMany<Products>(
    `SELECT name, price, stock, description FROM products WHERE is_sold = false ORDER BY created_at ASC LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
}
