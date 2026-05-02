import { FastifyRequest, FastifyReply } from "fastify";
import {
  addCommentService,
  likesCommentService,
  uploadImgService,
  userService,
} from "@user/user.service";

export async function user(req: FastifyRequest, rep: FastifyReply) {
  const result = await userService(req.user.id);

  rep.ok(`Welcome back ${result.username}`, result);
}

export async function addComment(
  req: FastifyRequest<{
    Params: { id: string };
    Body: { comment: string; rate: number };
  }>,
  rep: FastifyReply,
) {
  await addCommentService(req.user.id, req.params.id, req.body);

  rep.ok("Comment added");
}

export async function uploadImg(
  req: FastifyRequest<{
    Querystring: { nameBefore: string; nameAfter: string };
  }>,
  rep: FastifyReply,
) {
  await uploadImgService(req);

  rep.ok("Successful uploaded file");
}

export async function likesComment(
  req: FastifyRequest<{
    Params: { id: string };
  }>,
  rep: FastifyReply,
) {
  await likesCommentService(req.user.id, req.params.id);

  rep.ok("Comment liked");
}
