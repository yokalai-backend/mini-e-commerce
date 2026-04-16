import { FastifyInstance } from "fastify";
import { login, refreshToken, register } from "./auth.controller";
import validateBody from "../../cores/utils/preValidation/validate.body";
import { loginSchema, registerSchema } from "./auth.schema";

export default function authRoute(app: FastifyInstance) {
  app.post(
    "/register",
    { preValidation: validateBody(registerSchema) },
    register,
  );

  app.post("/login", { preValidation: validateBody(loginSchema) }, login);

  app.delete("/ex", () => console.log("Example"));

  app.post("/refresh-token", refreshToken);

  app.put("/ex", () => console.log("Example"));
}
