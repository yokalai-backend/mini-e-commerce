import validateBody from "@utils/preValidation/validate.body";
import validateQuery from "@utils/preValidation/validate.query";
import verifyToken from "@utils/token/verify.token";
import validateParams from "@utils/preValidation/validate.params";
import { FastifyInstance } from "fastify";
import {
  addProduct,
  product,
  productComments,
  products,
  productsByFilter,
} from "@products/products.controller";
import { paginationSchema } from "@shared/schema";
import {
  addProductSchema,
  productFilterSchema,
  productIdSchema,
} from "@products/products.schema";

export default function productsRoute(app: FastifyInstance) {
  app.get(
    "/",
    {
      preValidation: [validateQuery(paginationSchema)],
    },
    products,
  ); // Get all the products that is sell, and I use pagination here.

  app.post(
    "/filter",
    {
      preValidation: [
        validateQuery(paginationSchema),
        validateBody(productFilterSchema),
      ],
    },
    productsByFilter,
  );

  app.get(
    "/:id",
    {
      preValidation: validateParams(productIdSchema),
    },
    product,
  );

  app.post(
    "/",
    { preValidation: [verifyToken, validateBody(addProductSchema)] },
    addProduct,
  );

  app.get(
    "/comments/:id",
    {
      preValidation: [
        validateParams(productIdSchema),
        validateQuery(paginationSchema),
      ],
    },
    productComments,
  );
}
