import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { comparePassword, signJwtToken } from "#/crypto-util.js";
import { UserRepository } from "#/database/repositories/user.repository.js";

export async function signIn(
  app: FastifyInstance,
  options: { userRepository: UserRepository },
) {
  const { userRepository } = options;

  app.withTypeProvider<ZodTypeProvider>().post(
    "/sign-in",
    {
      schema: {
        tags: ["auth"],
        summary: "Authenticate user",
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await userRepository.findByEmail(email);

      if (!user || !comparePassword(password, user.password)) {
        return reply.status(401).send({ message: "Invalid credentials" });
      }

      const token = signJwtToken({
        _id: user._id.toHexString(),
        role: user.role,
      });

      return reply.status(200).send({ token });
    },
  );
}
