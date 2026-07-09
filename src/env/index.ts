import z from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .union([z.literal("dev"), z.literal("production"), z.literal("test")])
    .default("dev"),
  PORT: z.coerce.number().default(3333),
  MONGODB_URI: z
    .string()
    .default("mongodb://localhost:27017/basic-backend-setup"),
  JWT_PRIVATE_KEY: z.string().default("secret"),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.log("Invalid enviroment variables.", _env.error.format());

  throw new Error("Invalid enviroment variables.");
}

export const env = _env.data;
