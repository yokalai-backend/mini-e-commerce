import verifyTokenPlugin from "@utils/token/verify.token.plugin";
import { FastifyInstance } from "fastify";
import { user } from "@user/user.controller";

export default function userRoute(app: FastifyInstance) {
  app.register(verifyTokenPlugin); // User need to login first in order to access this route.

  app.get("/", user); // Get the user's information
}
