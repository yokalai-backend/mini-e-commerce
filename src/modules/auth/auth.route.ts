import { FastifyInstance } from "fastify";

export default function routeName(app: FastifyInstance) {
  app.get("/ex", () => console.log("Example"));

  app.post("/ex", () => console.log("Example"));

  app.delete("/ex", () => console.log("Example"));

  app.patch("/ex", () => console.log("Example"));

  app.put("/ex", () => console.log("Example"));
}
