import type { FastifyInstance } from "fastify";
import { runMentor, runMentorStream, type ChatMessage } from "../mentor-service.js";
import { saveMessage } from "../db.js";

interface ChatBody {
  userId?: string;
  messages: ChatMessage[];
}

export async function chatRoutes(app: FastifyInstance) {
  const apiKey = process.env.OPENAI_API_KEY ?? "";

  app.post<{ Body: ChatBody }>("/chat", async (request, reply) => {
    const { userId, messages } = request.body;

    if (!messages?.length) {
      return reply.status(400).send({ error: "messages required" });
    }

    const result = await runMentor(messages, apiKey);

    if (userId) {
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      if (lastUser) await saveMessage(userId, "user", lastUser.content);
      await saveMessage(userId, "assistant", result.reply, result.sources.map((s) => s.title));
    }

    return { reply: result.reply, sources: result.sources };
  });

  app.post<{ Body: ChatBody }>("/chat/stream", async (request, reply) => {
    const { userId, messages } = request.body;

    if (!messages?.length) {
      return reply.status(400).send({ error: "messages required" });
    }

    reply.raw.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    let fullReply = "";
    let sources: Array<{ title: string; sourceUrl: string | null; score: number }> = [];

    for await (const event of runMentorStream(messages, apiKey)) {
      if (event.type === "chunk") {
        fullReply += event.content;
        reply.raw.write(`data: ${JSON.stringify({ content: event.content })}\n\n`);
      } else if (event.type === "done") {
        sources = event.sources;
        reply.raw.write(`data: ${JSON.stringify({ done: true, sources: event.sources })}\n\n`);
      }
    }

    if (userId) {
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      if (lastUser) await saveMessage(userId, "user", lastUser.content);
      await saveMessage(userId, "assistant", fullReply, sources.map((s) => s.title));
    }

    reply.raw.end();
  });
}
