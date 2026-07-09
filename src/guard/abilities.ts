import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
} from "@casl/ability";

import { UserEntity } from "#/database/entities/user.entity.js";

import { Panel, Role } from "./roles.js";
import { AppAbility, AppSubjects } from "./subjects.js";

export function createAbilityForUser(user: UserEntity): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  switch (user.role) {
    case Role.ADMIN:
      can("manage", "all");
      can("access", "Panel", {
        name: { $in: [Panel.DASHBOARD, Panel.USERS, Panel.FINANCIAL] },
      });
      break;

    case Role.MANAGER:
      can("access", "Panel", {
        name: { $in: [Panel.DASHBOARD, Panel.USERS] },
      });
      can(["read", "update"], "User", { _id: user._id });
      can("read", "User");
      break;

    case Role.USER:
      can("read", "User", { _id: user._id });
      can("access", "Panel", { name: Panel.DASHBOARD });
      break;
  }

  return build({
    detectSubjectType: (item) =>
      item.constructor.name.replace(
        /Entity$/,
        "",
      ) as ExtractSubjectType<AppSubjects>,
  });
}
