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
      await saveMessage(userId, "assistant", result);
    }

    return { reply: result };
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

    for await (const chunk of runMentorStream(messages, apiKey)) {
      fullReply += chunk;
      reply.raw.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    }

    reply.raw.write(`data: ${JSON.stringify({ done: true })}\n\n`);

    if (userId) {
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      if (lastUser) await saveMessage(userId, "user", lastUser.content);
      await saveMessage(userId, "assistant", fullReply);
    }

    reply.raw.end();
  });
}
