import { FastifyInstance } from "fastify";
import verifyToken from "../../cores/utils/token/verify.token";
import { cart, product, products } from "./products.controller";
import validateQuery from "../../cores/utils/preValidation/validate.query";
import { paginationSchema } from "../../shared/schema";
import validateParams from "../../cores/utils/preValidation/validate.params";
import { amountProductSchema, productIdSchema } from "./products.schema";

export default function productsRoute(app: FastifyInstance) {
  app.register(verifyToken);

  app.get("/", { preValidation: validateQuery(paginationSchema) }, products);

  app.get("/:id", { preValidation: validateParams(productIdSchema) }, product);

  app.post(
    "/cart/:id",
    {
      preValidation: [
        validateParams(productIdSchema),
        validateQuery(amountProductSchema),
      ],
    },
    cart,
  );

  app.patch("/ex", () => console.log("Example"));

  app.put("/ex", () => console.log("Example"));
}
