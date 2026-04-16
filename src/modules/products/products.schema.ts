import { z } from "zod";

export const productIdSchema = z.object({
  id: z.uuid(),
});

export const productDetailedParser = z
  .object({
    owner_id: z.uuid(),
    owner_name: z.string(),
    product_id: z.uuid(),
    product_name: z.string(),
    price: z.coerce.number(),
    stock: z.coerce.number(),
    description: z.string(),
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
      productStock: p.price,
      productDescription: p.description,
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
  }));

export type ProductDetailedProps = z.infer<typeof productDetailedParser>;
