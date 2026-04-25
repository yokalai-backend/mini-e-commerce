import pool from "@config/db";
import Errors from "@errors/errors";

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
