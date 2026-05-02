// Here are i define all of the types i would use oftenly no matter what modules uses it.
export type Roles = "user" | "admin"; // It's often used for auth and  jwt tokens.

export interface PaginationProps {
  limit: number;
  offset: number;
} // It's a basic pagination requirements.

// Indeed i have to declare these types globally so i don't have to hardcode and it helps me autocorrect.
declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: string;
      username: string;
      role: Roles;
    };
    cookies: {
      accessToken: string;
      refreshToken: string;
      deviceId: string;
    };
  }
}
