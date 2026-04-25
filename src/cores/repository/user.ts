import { UserProps } from "@user/user.schema";
import { queryOne } from "@utils/query/query";

export async function userHelper(userId: string) {
  return await queryOne<UserProps>(
    `SELECT * FROM users WHERE id = $1 AND is_active = true`,
    [userId],
  ); // Get the user data only if the user is not banned and exists.
}
