import validateBody from "@utils/preValidation/validate.body";
import { FastifyInstance } from "fastify";
import { login, logout, refreshToken, register } from "@auth/auth.controller";
import { loginSchema, registerSchema } from "@auth/auth.schema";

export default function authRoute(app: FastifyInstance) {
  app.post(
    "/register",
    { preValidation: validateBody(registerSchema) },
    register,
  );

  app.post("/login", { preValidation: validateBody(loginSchema) }, login);

  app.post("/logout", logout);

  app.post("/refresh", refreshToken);
}
