import { RegisterInput } from "../../../modules/auth/auth.types";
import { queryOne } from "../../utils/query/query";

export default async function registerRepo(
  input: RegisterInput,
): Promise<void> {
  const { username, password, email } = input;

  await queryOne(
    `INSERT INTO users (username, hash, email) VALUES ($1, $2, $3) RETURNING created_at`,
    [username, password, email],
  );
}
