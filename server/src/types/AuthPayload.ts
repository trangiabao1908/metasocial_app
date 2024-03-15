import { JwtPayload } from "jsonwebtoken";
export type AuthPayload = JwtPayload & {
  userId: string;
};
