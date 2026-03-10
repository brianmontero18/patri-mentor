import type { FastifyInstance } from "fastify";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async () => ({
    status: "ok",
    service: "patri-mentor",
    timestamp: new Date().toISOString(),
  }));
}
