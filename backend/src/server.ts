/**
 * Patri Mentor — Backend
 *
 * Phase 1: Context stuffing (methodology in system prompt).
 * Phase 3 (future): RAG pipeline.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import { initDb } from "./db.js";
import { healthRoutes } from "./routes/health.js";
import { chatRoutes } from "./routes/chat.js";
import { userRoutes } from "./routes/users.js";

const OPENAI_KEY = process.env.OPENAI_API_KEY ?? "";
const PORT = parseInt(process.env.PORT ?? "3001", 10);
const IS_PROD = process.env.NODE_ENV === "production";

function assertEnv() {
  const missing = [!OPENAI_KEY && "OPENAI_API_KEY"].filter(Boolean);
  if (missing.length) {
    throw new Error(`Missing env vars: ${missing.join(", ")}`);
  }
}

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });

await app.register(
  async (api) => {
    await api.register(healthRoutes);
    await api.register(chatRoutes);
    await api.register(userRoutes);
  },
  { prefix: "/api" },
);

if (IS_PROD) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const frontendDist = path.resolve(__dirname, "../../frontend/dist");

  await app.register(fastifyStatic, {
    root: frontendDist,
    wildcard: false,
  });

  app.setNotFoundHandler(async (_req, reply) => {
    return reply.sendFile("index.html");
  });
}

try {
  assertEnv();
  await initDb();
  await app.listen({ port: PORT, host: "0.0.0.0" });
  app.log.info(`Patri Mentor backend running on port ${PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
