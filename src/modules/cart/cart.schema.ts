import { z } from "zod";

export const getProductsSchema = z.array(
  z.object({
    id: z.uuid(),
    amount: z.coerce.number().min(1, { error: "Amount invalid" }),
  }),
);

export type GetProductsProps = z.infer<typeof getProductsSchema>;
