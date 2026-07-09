import { Filter } from "mongodb";

import { AppAbility, AppActions, subjects } from "./subjects.js";

export function toMongoQuery<T = unknown>(
  ability: AppAbility,
  action: AppActions,
  subject: (typeof subjects)[number],
): Filter<T> | null {
  const rules = ability.rulesFor(action, subject);

  if (rules.some((rule) => !rule.inverted && !rule.conditions)) {
    return null;
  }

  const allowed = rules
    .filter((rule) => !rule.inverted && rule.conditions)
    .map((rule) => rule.conditions as Filter<T>);

  if (allowed.length === 0) {
    return { _id: { $in: [] } } as Filter<T>;
  }

  return allowed.length === 1 ? allowed[0] : ({ $or: allowed } as Filter<T>);
}
