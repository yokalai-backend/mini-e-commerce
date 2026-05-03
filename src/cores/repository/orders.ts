import pool from "@config/db";
import Errors from "@errors/errors";
import { UserOrderProps } from "@orders/orders.schema";
import { queryMany, queryOne } from "@utils/query/query";

// This is where the crucial part is, so I use transaction query for this one.
export async function orderProductsHelper(userId: string) {
  const client = await pool.connect(); // We took 1 connection just for handle all of this.

  try {
    await client.query("BEGIN");

    const { rows: cartProducts } = await client.query(
      `SELECT product_id, quantity FROM user_cart WHERE user_id = $1`,
      [userId],
    ); // Get all the products inside of user's cart.

    if (cartProducts.length === 0) throw Errors.badRequest("Cart empty");

    const ordersValid = [];
    let total = 0;

    // Looping to each product inside the user's cart to check if it's valid or not.
    for (const item of cartProducts) {
      const { rows } = await client.query(
        `SELECT price, stock 
         FROM products 
         WHERE id = $1 
         FOR UPDATE`,
        [item.product_id],
      ); // Lock product with this id rows, so nobody could modify it until the transaction finish.

      if (rows.length === 0) throw Errors.badRequest("Product not found");

      const product = rows[0];

      if (item.quantity > product.stock)
        throw Errors.badRequest("Stock does not enough", "INSUFFICIENT_STOCK");

      const subtotal = product.price * item.quantity;
      total += subtotal;

      ordersValid.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });
    }

    const { rows: orderRows } = await client.query(
      `INSERT INTO orders (user_id, total_price, status) 
       VALUES ($1, $2, 'pending') 
       RETURNING id`,
      [userId, total],
    ); // Create the order, it just calculate the total_price.

    const orderId = orderRows[0].id;

    for (const item of ordersValid) {
      await client.query(
        `INSERT INTO order_items 
         (order_id, product_id, quantity, price, subtotal) 
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.product_id, item.quantity, item.price, item.subtotal],
      );

      await client.query(
        `UPDATE products 
         SET stock = stock - $1
         WHERE id = $2`,
        [item.quantity, item.product_id],
      );

      await client.query(
        `UPDATE product_details SET total_solds = total_solds + $1 WHERE product_id = $2`,
        [item.quantity, item.product_id],
      );
    }

    await client.query(`DELETE FROM user_cart WHERE user_id = $1`, [userId]); // Clean the user's cart afterward;

    await client.query("COMMIT");

    return { orderId, total };
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
}

export async function userOrdersHelper(userId: string, orderId: string) {
  const products = await queryMany<UserOrderProps>(
    `
    SELECT u.username AS owner_name, p.id AS product_id, p.name AS product_name, 
    p.image, os.id AS order_id, os.total_price, os.status, os.created_at, oi.quantity, oi.subtotal, oi.price
    FROM products p 
    INNER JOIN order_items oi ON p.id = oi.product_id INNER JOIN orders os ON 
    os.id = oi.order_id 
    INNER JOIN users u
    ON u.id = p.user_id
    WHERE os.id = $1 AND os.user_id = $2`,
    [orderId, userId],
  );

  const grouped = Object.values(
    products.reduce(
      (acc, row) => {
        const orderId = row.order_id;

        if (!acc[orderId]) {
          acc[orderId] = {
            orderId,
            status: row.status,
            totalPrice: row.total_price,
            orderedAt: row.created_at,
            items: [],
          };
        }

        acc[orderId].items.push({
          ownerName: row.owner_name,
          productId: row.product_id,
          productName: row.product_name,
          productImage: row.image,
          quantity: row.quantity,
          productPrice: row.price,
          subTotal: row.subtotal,
        });

        return acc;
      },
      {} as Record<string, any>,
    ),
  );

  return grouped;
}

export async function ordersListHelper(userId: string) {
  return await queryMany<{ id: string }>(
    `SELECT id FROM orders WHERE user_id = $1`,
    [userId],
  );
}

export async function userOrderItemsHelper(userId: string, productId: string) {
  return await queryOne(
    `SELECT oi.id FROM order_items oi INNER JOIN orders o ON o.id = oi.order_id WHERE user_id = $1 AND product_id = $2`,
    [userId, productId],
  );
}
