import { FastifyInstance } from "fastify";
import { register } from "./auth.controller";
import validateBody from "../../cores/utils/preValidation/validate.body";
import { registerSchema } from "./auth.schema";

export default function authRoute(app: FastifyInstance) {
  app.post(
    "/register",
    { preValidation: validateBody(registerSchema) },
    register,
  );

  app.post("/ex", () => console.log("Example"));

  app.delete("/ex", () => console.log("Example"));

  app.patch("/ex", () => console.log("Example"));

  app.put("/ex", () => console.log("Example"));
}
