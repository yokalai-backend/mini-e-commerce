export type Roles = "user" | "admin";

export interface PaginationProps {
  limit: number;
  offset: number;
}

declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: string;
      username: string;
      role: Roles;
    };
  }
}
