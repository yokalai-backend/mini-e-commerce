import { Roles } from "../../shared/types";

export interface RegisterInput {
  username: string;
  password: string;
  email: string;
}

export interface LoginInput {
  password: string;
  email: string;
}

export interface TokenPayload {
  id: string;
  username: string;
  role: Roles;
}
