import { MongoAbility } from "@casl/ability";

import { UserEntity } from "#/database/entities/user.entity.js";

export const actions = [
  "manage",
  "create",
  "read",
  "update",
  "delete",
  "access",
] as const;

export const subjects = ["User", "Panel", "all"] as const;

export type AppActions = (typeof actions)[number];

export type AppSubjects = (typeof subjects)[number] | UserEntity;

export type AppAbility = MongoAbility<[AppActions, AppSubjects]>;
