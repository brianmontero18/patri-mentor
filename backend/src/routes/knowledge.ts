import type { FastifyInstance } from "fastify";
import { ingestContent } from "../rag/ingest.js";
import { listKnowledgeSources, deleteKnowledgeSource } from "../db.js";

interface IngestBody {
  title: string;
  source: string;
  content: string;
  type: "transcript" | "article" | "book" | "notes" | "podcast";
}

export async function knowledgeRoutes(app: FastifyInstance) {
  const apiKey = process.env.OPENAI_API_KEY ?? "";

  app.post<{ Body: IngestBody }>("/knowledge/ingest", async (request, reply) => {
    const { title, source, content, type } = request.body;

    if (!title || !content || !type) {
      return reply.status(400).send({ error: "title, content, and type are required" });
    }

    const result = await ingestContent(
      { title, source: source ?? "", sourceType: type, content },
      apiKey,
    );

    return {
      sourceId: result.sourceId,
      chunksCreated: result.chunksCreated,
      message: `Ingested "${title}" → ${result.chunksCreated} chunks`,
    };
  });

  app.get("/knowledge", async () => {
    const sources = await listKnowledgeSources();
    return { sources };
  });

  app.delete<{ Params: { sourceId: string } }>("/knowledge/:sourceId", async (request, reply) => {
    const deleted = await deleteKnowledgeSource(request.params.sourceId);
    if (deleted === 0) {
      return reply.status(404).send({ error: "source not found" });
    }
    return { deleted, message: `Deleted ${deleted} chunks` };
  });
}
