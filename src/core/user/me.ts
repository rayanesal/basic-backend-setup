import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { UserRepository } from "#/database/repositories/user.repository.js";
import { requireAuth } from "#/guard/index.js";
import { createAuthenticate } from "#/middleware/auth.middleware.js";

export async function me(
  app: FastifyInstance,
  options: { userRepository: UserRepository },
) {
  const authenticate = createAuthenticate(options.userRepository);

  app.withTypeProvider<ZodTypeProvider>().get(
    "/me",
    {
      onRequest: [authenticate, requireAuth],
      schema: {
        tags: ["auth"],
        summary: "Current user profile",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            _id: z.string(),
            role: z.string(),
            name: z.string(),
            email: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send({
        _id: request.user!._id.toHexString(),
        role: request.user!.role,
        name: request.user!.name,
        email: request.user!.email,
      });
    },
  );
}
