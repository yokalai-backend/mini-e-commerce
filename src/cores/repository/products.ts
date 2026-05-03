import { queryMany, queryOne } from "@utils/query/query";
import { PaginationProps } from "@shared/types";
import {
  AddProductProps,
  ProductDetailParserProps,
  ProductFilterProps,
} from "@products/products.schema";
import { CommentProps, ProductsProps } from "@products/products.type";

export async function productHelper(productId: string) {
  const result = await queryOne<ProductDetailParserProps>(
    `
    SELECT u.id AS owner_id, u.username AS owner_name, p.id AS product_id, p.name AS product_name, p.price, p.stock, p.image, p.created_at, p.updated_at,
    pd.category, pd.send_from, pd.rating, pd.total_reviews, pd.total_solds FROM users u LEFT JOIN
    products p ON u.id = p.user_id LEFT JOIN product_details pd ON pd.product_id = p.id
    WHERE u.is_active = true AND p.is_sold = false AND p.id = $1::uuid
    `,
    [productId],
  );
  return result;
}

export async function productsHelper({ limit, offset }: PaginationProps) {
  return await queryMany<ProductsProps>(
    `SELECT u.id AS owner_id, u.username AS owner_name, p.id AS product_id, p.name AS product_name, p.price, p.stock, p.image,
    pd.category, pd.send_from, pd.rating, pd.total_solds FROM users u INNER JOIN products p ON u.id = p.user_id INNER JOIN
    product_details pd ON pd.product_id = p.id WHERE p.is_sold = false AND u.is_active = true ORDER BY p.created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
}

export async function productsByFilterHelper(
  { limit, offset }: PaginationProps,
  filters: ProductFilterProps,
) {
  if (filters.category.length <= 0) {
    return await queryMany<ProductsProps>(
      `SELECT u.id AS owner_id, u.username AS owner_name, p.id AS product_id, p.name AS product_name, p.price, p.stock, p.image,
    pd.category, pd.send_from, pd.rating, pd.total_solds FROM users u INNER JOIN products p ON u.id = p.user_id INNER JOIN
    product_details pd ON pd.product_id = p.id WHERE p.is_sold = false AND u.is_active = true ORDER BY ${filters.order} LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
  }

  const res = await queryMany<ProductsProps>(
    `SELECT u.id AS owner_id, u.username AS owner_name, p.id AS product_id, p.name AS product_name, p.price, p.stock, p.image,
    pd.category, pd.send_from, pd.rating, pd.total_solds FROM users u INNER JOIN products p ON u.id = p.user_id INNER JOIN
    product_details pd ON pd.product_id = p.id WHERE p.is_sold = false AND u.is_active = true AND pd.category = ANY($1::text[]) ORDER BY ${filters.order} LIMIT $2 OFFSET $3`,
    [filters.category, limit, offset],
  );

  return res;
}

export async function addProductHelper(
  userId: string,
  addedProduct: AddProductProps,
) {
  const { name, price, stock, image, sendFrom, category } = addedProduct;

  let currentImageName;
  let path = image;

  const isHttps = image.startsWith("https");

  if (!isHttps)
    path = `https://projector-devious-spray.ngrok-free.dev/uploads/${image}`;

  try {
    const res = await queryOne<{ image: string }>(
      `SELECT image FROM products WHERE name = $1 AND user_id = $2`,
      [name, userId],
    );

    if (res) currentImageName = res.image;
  } catch (error) {}

  const { id, inserted } = await queryOne<{
    id: string;
    inserted: boolean;
  }>(
    `INSERT INTO products (user_id, name, price, stock, image) VALUES ($1, $2, $3, $4, $5) 
    ON CONFLICT(user_id, name) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock, image = EXCLUDED.image RETURNING id, (xmax = 0) AS inserted`,
    [userId, name, price, stock, path],
  ); // I use upsert so if the product with the same name already exists then the action will be considered as update.

  await queryOne(
    `INSERT INTO product_details (product_id, send_from, category) VALUES ($1, $2, $3) ON CONFLICT(product_id) 
    DO UPDATE SET send_from = EXCLUDED.send_from, category = EXCLUDED.category`,
    [id, sendFrom, category],
  ); // The same concept here, but here just upsert the added product information in details.

  const formatted = {
    id,
    currentImageName,
  };

  if (inserted) {
    return { message: "Product added", formatted };
  } else {
    return { message: "Current product updated", formatted };
  }
}

export async function productCommentHelper(
  productId: string,
  pagination: PaginationProps,
) {
  const { limit, offset } = pagination;

  const res = await queryMany<CommentProps>(
    `SELECT COUNT(*) OVER() AS total, u.id, u.username, c_o.id AS comment_id, c_o.comment, c_o.likes_count, c_o.rates, c_o.created_at FROM 
    users u INNER JOIN comments c_o ON u.id = c_o.by_user WHERE c_o.product_id = $1::uuid ORDER BY c_o.created_at DESC LIMIT $2 OFFSET $3`,
    [productId, limit, offset],
  );

  const formatted = res.map(
    ({ likes_count, comment_id, created_at, ...rest }) => ({
      ...rest,
      likes: likes_count,
      commentId: comment_id,
      createdAt: created_at,
    }),
  );

  return formatted;
}
