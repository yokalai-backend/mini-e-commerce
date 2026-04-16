import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import fp from "fastify-plugin";
import Errors from "../../errors/errors";
import env from "../../config/env";
import { Roles } from "../../../shared/types";

async function verifyToken(app: FastifyInstance) {
  app.addHook("preHandler", async (req: FastifyRequest, rep: FastifyReply) => {
    const headers = req.headers.authorization;

    if (!headers) throw Errors.authorization("No token provided", "NO_TOKEN");

    if (!headers.startsWith("Bearer "))
      throw Errors.authorization("Token format invalid", "TOKEN_INVALID");

    const token = headers.split(" ")[1];

    try {
      const decoded = jwt.verify(token, env.ACCESS_SECRET) as {
        id: string;
        username: string;
        role: Roles;
      };

      req.user = decoded;
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw Errors.authorization("Token expired", "TOKEN_EXPIRED");

      if (error instanceof JsonWebTokenError)
        throw Errors.authorization("Token invalid", "INVALID_TOKEN");

      throw error;
    }
  });
}

export default fp(verifyToken);
