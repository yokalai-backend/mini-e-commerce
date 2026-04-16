import { FastifyInstance } from "fastify";
import verifyToken from "../../cores/utils/token/verify.token";
import { product, products } from "./products.controller";
import validateQuery from "../../cores/utils/preValidation/validate.query";
import { paginationSchema } from "../../shared/schema";
import validateParams from "../../cores/utils/preValidation/validate.params";
import { productIdSchema } from "./products.schema";

export default function productsRoute(app: FastifyInstance) {
  app.register(verifyToken);

  app.get("/", { preValidation: validateQuery(paginationSchema) }, products);

  app.get("/:id", { preValidation: validateParams(productIdSchema) }, product);

  app.delete("/ex", () => console.log("Example"));

  app.patch("/ex", () => console.log("Example"));

  app.put("/ex", () => console.log("Example"));
}
