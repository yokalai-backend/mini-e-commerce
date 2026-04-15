import { FastifyRequest, FastifyReply } from "fastify";
import { registerService } from "./auth.service";
import { RegisterInput } from "./auth.types";

export async function register(
  req: FastifyRequest<{ Body: RegisterInput }>,
  rep: FastifyReply,
) {
  await registerService(req.body);

  rep.ok("Account registered", 201);
}

export async function excName2(req: FastifyRequest, rep: FastifyReply) {
  // Code goes here
}

export async function excName3(req: FastifyRequest, rep: FastifyReply) {
  // Code goes here
}

export async function excName4(req: FastifyRequest, rep: FastifyReply) {
  // Code goes here
}

export async function excName5(req: FastifyRequest, rep: FastifyReply) {
  // Code goes here
}
