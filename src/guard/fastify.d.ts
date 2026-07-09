import "fastify";

import { UserEntity } from "#/database/entities/user.entity.js";
import { createAbilityForUser } from "#/guard/abilities.js";

declare module "fastify" {
  interface FastifyRequest {
    user?: UserEntity;
    ability?: ReturnType<typeof createAbilityForUser>;
  }
}
