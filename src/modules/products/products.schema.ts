import { z } from "zod";

export const productIdSchema = z.object({
  id: z.uuid(),
}); // A first attempt checking if the id is literally an UUID or not.

export const productAmountSchema = z.object({
  quantity: z.coerce
    .number({ error: "Quantity needed" })
    .min(1, { error: "Quantity can't be less than 1" }),
}); // A validation for the requested product quantity.

export const productDetailParser = z
  .object({
    owner_id: z.uuid(),
    owner_name: z.string(),
    product_id: z.uuid(),
    product_name: z.string(),
    price: z.coerce.number(),
    stock: z.coerce.number(),
    image: z.url(),
    send_from: z.string(),
    category: z.string(),
    rating: z.coerce.number(),
    total_solds: z.coerce.number(),
  })
  .transform((p) => ({
    product: {
      productId: p.product_id,
      productName: p.product_name,
      productPrice: p.price,
      productStock: p.stock,
      productImage: p.image,
    },
    productDetail: {
      sendFrom: p.send_from,
      category: p.category,
      rating: p.rating,
      totalSolds: p.total_solds,
    },
    owner: {
      ownerId: p.owner_id,
      ownerName: p.owner_name,
    },
  })); // A parser to only one product.

export const productsDetailsParser = z.array(productDetailParser); // This is parser for group of products in an array.

export const addProductSchema = z.object({
  name: z.string({ error: "Name of the product is needed" }),
  price: z.coerce
    .number({ error: "Price of the product is needed" })
    .min(1, { error: "Price can't be 0" }),
  stock: z.coerce
    .number({ error: "Stock of the product is needed" })
    .min(1, { error: "Stock can't be 0" }),
  image: z.url({ error: "Image url of the product is needed" }),
  sendFrom: z.string({ error: "Send from location of the product is needed" }),
  category: z.string({ error: "Category of the product is needed" }),
}); // A validation for adding self product.

export type AddProductProps = z.infer<typeof addProductSchema>;
