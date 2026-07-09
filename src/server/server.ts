import { connectDatabase, getDatabase } from "#/database/mongodb.js";
import { UserRepository } from "#/database/repositories/user.repository.js";
import { env } from "#/env/index.js";

import { me, signIn, signUp } from "../core/user/index.js";
import { app } from "./app.js";

await connectDatabase();

const userRepository = new UserRepository(getDatabase());

app.register(signIn, { userRepository });
app.register(signUp, { userRepository });
app.register(me, { userRepository });

await app.ready();
await app.listen({ port: env.PORT });
console.log("HTTP server running!");
