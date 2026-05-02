import { UserProps } from "@user/user.schema";
import { queryOne } from "@utils/query/query";

export async function userHelper(userId: string) {
  return await queryOne<UserProps>(
    `SELECT * FROM users WHERE id = $1 AND is_active = true`,
    [userId],
  ); // Get the user data only if the user is not banned and exists.
}

export async function addCommentHelper(
  userId: string,
  productId: string,
  comment: string,
  rate: number,
) {
  await queryOne(
    `INSERT INTO comments (by_user, product_id, comment, rates) VALUES ($1, $2, $3, $4)`,
    [userId, productId, comment, rate],
  );
}

export async function likesCommentHelper(userId: string, commentId: string) {
  return await queryOne(
    `WITH deleted AS (
      DELETE FROM comment_likes
      WHERE by_user = $1 AND comment_id = $2
      RETURNING 1
    )
    INSERT INTO comment_likes (by_user, comment_id)
    SELECT $1, $2
    WHERE NOT EXISTS (SELECT 1 FROM deleted);`,
    [userId, commentId],
  );
}
