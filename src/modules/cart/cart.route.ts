import { FastifyInstance } from "fastify";
import validateParams from "@utils/preValidation/validate.params";
import validateQuery from "@utils/preValidation/validate.query";
import { productIdSchema } from "@products/products.schema";
import { amountProductSchema } from "@products/products.schema";
import { addToCart, getProductsCart } from "./cart.controller";
import validateBody from "@utils/preValidation/validate.body";
import { getProductsSchema } from "./cart.schema";

export default function cartRoute(app: FastifyInstance) {
  app.post(
    "/:id",
    {
      preValidation: [
        validateParams(productIdSchema),
        validateQuery(amountProductSchema),
      ],
    },
    addToCart,
  );

  app.post(
    "/",
    { preValidation: validateBody(getProductsSchema) },
    getProductsCart,
  );

  app.delete("/ex", () => console.log("Example"));

  app.patch("/ex", () => console.log("Example"));

  app.put("/ex", () => console.log("Example"));
}
