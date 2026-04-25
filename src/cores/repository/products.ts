import { queryMany, queryOne } from "@utils/query/query";
import { PaginationProps } from "@shared/types";
import { AddProductProps } from "@products/products.schema";
import { ProductsProps } from "@products/products.type";

export async function productHelper(productId: string) {
  const result = await queryOne<ProductsProps>(
    `
    SELECT u.id AS owner_id, u.username AS owner_name, p.id AS product_id, p.name AS product_name, p.price, p.stock, p.description, 
    pd.category, pd.send_from, pd.rating, pd.total_solds FROM users u LEFT JOIN
    products p ON u.id = p.user_id LEFT JOIN product_details pd ON pd.product_id = p.id
    WHERE u.is_active = true AND p.is_sold = false AND p.id = $1
    `,
    [productId],
  ); // Check out the type I put in the query to see all the fields i tried to get, in short this query will get the detail information of one product.

  return result;
}

export async function productsHelper({ limit, offset }: PaginationProps) {
  return await queryMany<ProductsProps>(
    `SELECT u.id AS owner_id, u.username AS owner_name, p.id AS product_id, p.name AS product_name, p.price, p.stock, p.image,
    pd.category, pd.send_from, pd.rating, pd.total_solds FROM users u INNER JOIN products p ON u.id = p.user_id INNER JOIN
    product_details pd ON pd.product_id = p.id WHERE p.is_sold = false AND u.is_active = true ORDER BY pd.rating DESC LIMIT $1 OFFSET $2`,
    [limit, offset],
  ); // It's the same with the other one actually, but this one is in group.
}

export async function addProductHelper(
  userId: string,
  addedProduct: AddProductProps,
) {
  const { name, price, stock, image, sendFrom, category } = addedProduct;

  const { id, inserted } = await queryOne<{ id: string; inserted: boolean }>(
    `INSERT INTO products (user_id, name, price, stock, image) VALUES ($1, $2, $3, $4, $5) 
    ON CONFLICT(user_id, name) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock, image = EXCLUDED.image RETURNING id, (xmax = 0) AS inserted`,
    [userId, name, price, stock, image],
  ); // I use upsert so if the product with the same name already exists then the action will be considered as update.

  await queryOne(
    `INSERT INTO product_details (product_id, send_from, category) VALUES ($1, $2, $3) ON CONFLICT(product_id) 
    DO UPDATE SET send_from = EXCLUDED.send_from, category = EXCLUDED.category`,
    [id, sendFrom, category],
  ); // The same concept here, but here just upsert the added product information in details.

  if (inserted) {
    return "Product added";
  } else {
    return "Current product updated";
  }
}
