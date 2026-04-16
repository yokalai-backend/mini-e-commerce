import { FastifyInstance } from "fastify";
import { login, logout, refreshToken, register } from "./auth.controller";
import validateBody from "../../cores/utils/preValidation/validate.body";
import { loginSchema, registerSchema } from "./auth.schema";

export default function authRoute(app: FastifyInstance) {
  app.post(
    "/register",
    { preValidation: validateBody(registerSchema) },
    register,
  );

  app.post("/login", { preValidation: validateBody(loginSchema) }, login);

  app.post("/logout", logout);

  app.post("/refresh-token", refreshToken);
}
