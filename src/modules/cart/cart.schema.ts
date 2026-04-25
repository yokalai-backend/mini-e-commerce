import { z } from "zod";

export const addUserCartSchema = z.array(
  z.object({
    id: z.uuid(),
    amount: z.coerce.number().min(1, { error: "Amount invalid" }),
  }),
);

export type GetProductsProps = z.infer<typeof addUserCartSchema>;

export const cartProductSchema = z.object({
  id: z.uuid(),
  amount: z.coerce
    .number()
    .min(1, { error: "Minimum amount is 1" })
    .max(50, { error: "Sorry maximum requested amount is 50" }),
});

export type CartProductSchema = z.infer<typeof cartProductSchema>;

export const userCartSchema = z.array(cartProductSchema);

export type AddProductsProps = z.infer<typeof userCartSchema>;
