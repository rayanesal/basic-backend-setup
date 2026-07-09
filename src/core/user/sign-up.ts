import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { hashPassword, signJwtToken } from "#/crypto-util.js";
import { UserEntity } from "#/database/entities/user.entity.js";
import { UserRepository } from "#/database/repositories/user.repository.js";
import { Role } from "#/guard/index.js";

export async function signUp(
  app: FastifyInstance,
  options: { userRepository: UserRepository },
) {
  const { userRepository } = options;

  app.withTypeProvider<ZodTypeProvider>().post(
    "/sign-up",
    {
      schema: {
        tags: ["auth"],
        summary: "Register user",
        body: z.object({
          name: z.string().min(1),
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      const existing = await userRepository.findByEmail(email);

      if (existing) {
        return reply.status(409).send({ message: "Email already registered" });
      }

      const user = new UserEntity({
        name,
        email,
        password: hashPassword(password),
        role: Role.USER,
      });

      await userRepository.create(user);

      const token = signJwtToken({
        _id: user._id.toHexString(),
        role: user.role,
      });

      return reply.status(201).send({ token });
    },
  );
}
