import { FastifyInstance, FastifyReply } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyReply {
    ok(message: string, data?: any, statusCode?: number): FastifyReply;
    notok(
      message: string | any[],
      code: string,
      statusCode?: number,
      messages?: string[],
    ): FastifyReply;
  }
}

function fastifyResponse(app: FastifyInstance) {
  app.decorateReply(
    "ok",
    function (
      this: FastifyReply,
      message: string,
      data: any = [],
      statusCode: number = 200,
    ) {
      return this.status(statusCode).send({ success: true, message, data });
    },
  );

  app.decorateReply(
    "notok",
    function (
      this: FastifyReply,
      message: string,
      code: string,
      statusCode: number = 500,
      messages: string[],
    ) {
      return this.code(statusCode).send({
        success: false,
        message,
        messages,
        code,
      });
    },
  );
}

export default fp(fastifyResponse);
