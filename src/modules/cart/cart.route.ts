import { FastifyInstance } from "fastify";
import validateParams from "@utils/preValidation/validate.params";
import validateQuery from "@utils/preValidation/validate.query";
import verifyToken from "@utils/token/verify.token";
import validateBody from "@utils/preValidation/validate.body";
import { productIdSchema } from "@products/products.schema";
import { productAmountSchema } from "@products/products.schema";
import {
  addProductsToCart,
  addProductToCart,
  getProductsCart,
} from "./cart.controller";
import { userCartSchema, addUserCartSchema } from "@cart/cart.schema";

export default function cartRoute(app: FastifyInstance) {
  app.post(
    "/:id",
    {
      preValidation: [
        validateParams(productIdSchema),
        validateQuery(productAmountSchema),
      ],
    },
    addProductToCart,
  ); // This endpoint use for adding the product user has been added to the cart when the user already login.

  app.post(
    "/add",
    {
      preValidation: [verifyToken, validateBody(addUserCartSchema)],
    },
    addProductsToCart,
  ); // Add all of the products the user have in their cart.

  app.post(
    "/",
    { preValidation: validateBody(addUserCartSchema) },
    getProductsCart,
  ); // This get all of the products from user's cart so then the FE could render the products image or show the information.
}
