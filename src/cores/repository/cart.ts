import Errors from "@errors/errors";
import { queryMany, queryOne } from "@utils/query/query";
import { AddToCart, Products } from "@products/products.type";
import { GetProductsProps } from "modules/cart/cart.schema";

export async function addToCartHelper({
  userId,
  productId,
  quantity,
}: AddToCart) {
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

// Solusi arah (bukan langsung full code)

// Ubah products jadi lookup table:

// key = id
// value = amount

// (ini biar akses O(1), bukan cari-cari lagi)

// Saat .map(result):
// ambil amount dari lookup berdasarkan e.id
// gabungkan ke object e

export async function getCartProductsHelper(products: GetProductsProps) {
  const productsMap = products.reduce((acc: any, e: any) => {
    const key = e.id;

    if (!acc[key]) acc[key] = e.amount;

    return acc;
  }, {});

  const productsId = products.map((e: any) => e.id);

  const productList = await queryMany<Products>(
    `SELECT id, name, price, stock, image FROM products
WHERE id = ANY($1::uuid[])`,
    [productsId],
  );

  const result = productList.map((e) =>
    productsMap[e.id] ? { ...e, amount: productsMap[e.id] } : e,
  );

  return result;
}
// I want it to return a data that contains product information and amount
