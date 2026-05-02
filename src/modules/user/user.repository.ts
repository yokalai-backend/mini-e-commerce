import {
  addCommentHelper,
  likesCommentHelper,
  userHelper,
} from "@repository/user";

const userRepo = {
  user: async (userId: string) => userHelper(userId),
  addComment: async (
    userId: string,
    productId: string,
    comment: string,
    rate: number,
  ) => addCommentHelper(userId, productId, comment, rate),
  likesComment: async (userId: string, commentId: string) =>
    likesCommentHelper(userId, commentId),
};

export default userRepo;
