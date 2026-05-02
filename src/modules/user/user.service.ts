import Errors from "@errors/errors";
import userRepo from "./user.repository";
import { userParser } from "./user.schema";
import path from "path";
import { pipeline } from "stream/promises";
import fs from "fs";
import { unlink } from "fs/promises";

export async function userService(userId: string) {
  const result = await userRepo.user(userId);

  if (!result) throw Errors.notFound("Sorry user not found try again later");

  return userParser.parse(result);
}

export async function addCommentService(
  userId: string,
  productId: string,
  { comment, rate }: any,
) {
  await userRepo.addComment(userId, productId, comment, rate);
}

export async function uploadImgService(req: any) {
  const data = await req.file();

  if (!data) return Errors.badRequest("No file");

  if (!["image/jpeg", "image/png", "image/webp"].includes(data.mimetype)) {
    return Errors.badRequest("Only jpeg and png are allowed");
  }

  if (data.file.truncated) {
    return Errors.badRequest("File too large (max 5MB)");
  }

  const uploadDir = path.join(process.cwd(), "uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const oldFile = req.query.nameBefore;

  if (oldFile !== req.query.nameAfter) {
    const oldPath = path.join(uploadDir, oldFile);

    try {
      await unlink(oldPath);
    } catch (err) {}
  }

  const fileName = `${req.query.nameAfter}`;

  const filePath = path.join(uploadDir, fileName);

  await pipeline(data.file, fs.createWriteStream(filePath));
}

export async function likesCommentService(userId: string, commentId: string) {
  const res = await userRepo.likesComment(userId, commentId);

  if (!res) Errors.notFound("Comment already deleted");

  return res;
}
