import { FastifyInstance } from "fastify";

import { product, products } from "./products.controller";
import validateQuery from "../../cores/utils/preValidation/validate.query";
import { paginationSchema } from "../../shared/schema";
import validateParams from "../../cores/utils/preValidation/validate.params";
import { productIdSchema } from "./products.schema";

export default function productsRoute(app: FastifyInstance) {
  app.get("/", { preValidation: validateQuery(paginationSchema) }, products);

  app.get("/:id", { preValidation: validateParams(productIdSchema) }, product);
}
