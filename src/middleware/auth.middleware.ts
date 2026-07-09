import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import fp from "fastify-plugin";

import { verifyJwtToken } from "#/crypto-util.js";
import { UserRepository } from "#/database/repositories/user.repository.js";
import { createAbilityForUser } from "#/guard/abilities.js";

export function createAuthenticate(userRepository: UserRepository) {
  return async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const authHeader = request.headers.authorization ?? "";

    if (!authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const token = authHeader.slice(7).trim();
    const payload = verifyJwtToken({ token });

    if (!payload) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const user = await userRepository.findById(payload._id);

    if (!user) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    request.user = user;
    request.ability = createAbilityForUser(user);
  };
}

export const authMiddleware: FastifyPluginAsync<{
  userRepository: UserRepository;
}> = fp(
  async (
    app: FastifyInstance,
    options: {
      userRepository: UserRepository;
    },
  ) => {
    const authenticate = createAuthenticate(options.userRepository);
    app.addHook("onRequest", authenticate);
  },
);
