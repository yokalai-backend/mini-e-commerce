import { z } from "zod";

export const userOrdersSchema = z.object({
  owner_name: z.string(),
  product_id: z.uuid(),
  product_name: z.string(),
  image: z.string(),
  quantity: z.coerce.number(),
  price: z.coerce.number(),
  subtotal: z.coerce.number(),
  status: z.string(),
  total_price: z.coerce.number(),
  created_at: z.date(),
  order_id: z.uuid(),
});

export type UserOrderProps = z.infer<typeof userOrdersSchema>;
