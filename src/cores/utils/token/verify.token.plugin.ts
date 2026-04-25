import fp from "fastify-plugin";
import Errors from "@errors/errors";
import env from "@config/env";
import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Roles } from "@shared/types";

// This are the plugin version where i'm gonna use for a strict endroutes.
async function verifyTokenPlugin(app: FastifyInstance) {
  app.addHook("preHandler", async (req: FastifyRequest, rep: FastifyReply) => {
    const token = req.cookies.accessToken;

    if (!token) throw Errors.authorization("No token provided", "NO_TOKEN");

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
        throw Errors.authorization("Invalid token", "INVALID_TOKEN");

      throw error;
    }
  });
}

export default fp(verifyTokenPlugin);
