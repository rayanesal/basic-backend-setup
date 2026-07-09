import { FastifyReply, FastifyRequest } from "fastify";

import { AppActions, AppSubjects } from "./subjects.js";

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (!request.user) {
    return reply.status(401).send({ message: "Unauthorized" });
  }
}

export function requireAbility(action: AppActions, subject: AppSubjects) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.ability || !request.ability.can(action, subject)) {
      return reply.status(403).send({ message: "Forbidden" });
    }
  };
}
