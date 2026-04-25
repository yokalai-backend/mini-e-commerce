import { z } from "zod";

export const userParser = z
  .object({
    id: z.uuid(),
    username: z.string(),
    role: z.enum(["user", "admin"]),
    created_at: z.date(),
  })
  .transform(({ created_at, ...rest }) => ({
    ...rest,
    createdAt: created_at,
  }));

export type UserProps = z.infer<typeof userParser>;
