import { FastifyRequest, FastifyReply } from "fastify";
import { userService } from "@user/user.service";

export async function user(req: FastifyRequest, rep: FastifyReply) {
  const result = await userService(req.user.id);

  rep.ok(`Welcome back ${result.username}`, result);
}
