import pool from "../config/db";
import Errors from "../errors/errors";
import { queryOne, queryMany } from "../utils/query/query";

export async function ordersHelper(userId: string) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows: cartProducts } = await client.query(
      `SELECT product_id, quantity FROM user_cart WHERE user_id = $1`,
      [userId],
    );

    if (cartProducts.length === 0) throw Errors.badRequest("Cart empty");

    const ordersValid = [];
    let total = 0;

    // 1. VALIDATE + HITUNG
    for (const item of cartProducts) {
      const { rows } = await client.query(
        `SELECT price, stock 
         FROM products 
         WHERE id = $1 
         FOR UPDATE`,
        [item.product_id],
      );

      if (rows.length === 0) throw Errors.badRequest("Product not found");

      const product = rows[0];

      if (item.quantity > product.stock)
        throw Errors.badRequest("Stock not enough");

      const subtotal = product.price * item.quantity;
      total += subtotal;

      ordersValid.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });
    }
    console.log(ordersValid);
    // 2. INSERT ORDER (1x)
    const { rows: orderRows } = await client.query(
      `INSERT INTO orders (user_id, total_price, status) 
       VALUES ($1, $2, 'pending') 
       RETURNING id`,
      [userId, total],
    );

    const orderId = orderRows[0].id;

    // 3. INSERT ORDER ITEMS + UPDATE STOCK
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
    }

    // 4. CLEAR CART
    await client.query(`DELETE FROM user_cart WHERE user_id = $1`, [userId]);

    await client.query("COMMIT");

    return { orderId, total };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
