import { describe, expect, it } from "vitest";

import { UserEntity } from "#/database/entities/user.entity.js";
import { createAbilityForUser, Role, toMongoQuery } from "#/guard/index.js";

function makeUser(role: Role): UserEntity {
  return new UserEntity({
    name: "Test",
    email: "test@example.com",
    password: "secret",
    role,
  });
}

describe("createAbilityForUser", () => {
  it("allows admin to manage everything", () => {
    const user = makeUser(Role.ADMIN);
    const ability = createAbilityForUser(user);

    expect(ability.can("manage", "all")).toBe(true);
    expect(ability.can("create", "User")).toBe(true);
    expect(ability.can("access", "Panel")).toBe(true);
  });

  it("allows regular user to read only itself", () => {
    const user = makeUser(Role.USER);
    const ability = createAbilityForUser(user);

    expect(ability.can("read", user)).toBe(true);
    expect(
      ability.can("read", new UserEntity({ ...user, _id: undefined })),
    ).toBe(false);
    expect(ability.can("create", "User")).toBe(false);
  });

  it("allows manager to access sportsbooks panel", () => {
    const user = makeUser(Role.MANAGER);
    const ability = createAbilityForUser(user);

    expect(ability.can("access", "Panel")).toBe(true);
    expect(ability.can("read", "User")).toBe(true);
    expect(ability.can("update", user)).toBe(true);
    expect(ability.can("delete", "User")).toBe(false);
  });
});

describe("toMongoQuery", () => {
  it("returns null when access is unrestricted", () => {
    const user = makeUser(Role.ADMIN);
    const ability = createAbilityForUser(user);

    expect(toMongoQuery(ability, "read", "User")).toBeNull();
  });

  it("returns own user filter for regular user", () => {
    const user = makeUser(Role.USER);
    const ability = createAbilityForUser(user);

    const query = toMongoQuery(ability, "read", "User");

    expect(query).toEqual({ _id: user._id });
  });
});
