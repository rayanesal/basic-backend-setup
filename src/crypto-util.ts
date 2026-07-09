import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import jwt from "jsonwebtoken";

import { Role } from "#/guard/index.js";

import { env } from "./env/index.js";

export interface JwtPayload {
  _id: string;
  role: Role;
}

export const signJwtToken = ({ _id, role }: JwtPayload) => {
  return jwt.sign({ _id, role }, env.JWT_PRIVATE_KEY, { expiresIn: "1d" });
};

export const verifyJwtToken = ({
  token,
}: {
  token: string;
}): JwtPayload | null => {
  try {
    const checking = jwt.verify(token, env.JWT_PRIVATE_KEY);

    return checking as JwtPayload;
  } catch {
    return null;
  }
};

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function comparePassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  const hashed = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(
    Buffer.from(hash) as Uint8Array,
    Buffer.from(hashed) as Uint8Array,
  );
}
