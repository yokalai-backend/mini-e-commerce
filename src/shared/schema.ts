import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(5).max(15).default(5).optional(),
});
