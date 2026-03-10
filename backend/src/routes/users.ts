import type { FastifyInstance } from "fastify";
import { createUser, getUser } from "../db.js";

export async function userRoutes(app: FastifyInstance) {
  app.post<{ Body: { name: string } }>("/users", async (request, reply) => {
    const { name } = request.body;
    if (!name) {
      return reply.status(400).send({ error: "name required" });
    }
    const id = await createUser(name);
    return { id, name };
  });

  app.get<{ Params: { id: string } }>("/users/:id", async (request, reply) => {
    const user = await getUser(request.params.id);
    if (!user) {
      return reply.status(404).send({ error: "user not found" });
    }
    return user;
  });
}
