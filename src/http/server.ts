import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import { env } from "~/env";

import { getHelloWorld } from "./routes/get-hello-world";
import { sayHello } from "./routes/say-hello";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Basic Backend Setup",
      description: "",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.register(getHelloWorld);
app.register(sayHello);

app.listen({ port: env.PORT }).then(() => {
  console.log("HTTP server running!");
});
