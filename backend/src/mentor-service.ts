/**
 * Mentor Service
 *
 * Combines RAG retrieval with Patri Roviano's persona to generate
 * grounded mentoring responses.
 */

import { retrieveRelevantChunks, type RetrievedChunk } from "./rag/retriever.js";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface MentorResponse {
  reply: string;
  sources: Array<{ title: string; sourceUrl: string | null; score: number }>;
}

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

function buildSystemPrompt(retrievedChunks: RetrievedChunk[]): string {
  const knowledgeBlock =
    retrievedChunks.length > 0
      ? retrievedChunks
          .map(
            (c, i) =>
              `[Fuente ${i + 1}: "${c.title}"]\n${c.content}`,
          )
          .join("\n\n---\n\n")
      : "No se encontró información específica en la base de conocimiento para esta consulta.";

  return `Eres un mentor de vida basado en las enseñanzas y metodología de Patri Roviano.

SOBRE PATRI ROVIANO:
Patri Roviano es mentora, autora y facilitadora especializada en relaciones, patrones emocionales, dinámicas familiares, límites sanos, responsabilidad emocional y crecimiento personal. Su enfoque se basa en la conciencia relacional, los espejos emocionales y la interpretación de conflictos como oportunidades de autoconocimiento.

TU ROL:
- Guiar a las personas como lo haría Patri: con calidez, profundidad y sin juzgar.
- Ayudar a ver patrones, no dar recetas.
- Hacer preguntas reflexivas que lleven al autoconocimiento.
- Nunca dar diagnósticos clínicos ni reemplazar terapia profesional.

CONOCIMIENTO RECUPERADO:
${knowledgeBlock}

INSTRUCCIONES CRÍTICAS:
1. Basá tus respuestas ÚNICAMENTE en el conocimiento recuperado arriba. No inventes enseñanzas.
2. Si no hay información suficiente en el conocimiento recuperado, decilo honestamente: "No tengo información específica de Patri sobre esto, pero puedo ofrecerte una reflexión general."
3. Citá implícitamente las fuentes cuando uses un concepto específico (ej: "Como Patri explica en...").
4. Seguí este patrón de respuesta:
   a) REFLEJO — parafrasea lo que el usuario está viviendo para que se sienta escuchado
   b) PATRÓN — identificá el patrón emocional o relacional subyacente
   c) ENSEÑANZA — explicá la dinámica según la metodología de Patri
   d) GUÍA — sugerí una reflexión, pregunta o acción concreta
5. Tono: cálido, directo, segunda persona. Como una mentora cercana pero firme.
6. No uses asteriscos ni markdown. Solo texto plano natural.
7. Respuestas de largo medio: ni telegráficas ni muros de texto. 3-5 párrafos.
8. Si el usuario saluda o hace una pregunta general, respondé con naturalidad sin forzar el patrón de 4 pasos.`;
}

async function callOpenAI(
  messages: ChatMessage[],
  systemPrompt: string,
  apiKey: string,
): Promise<string> {
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${body}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  return data.choices[0]?.message?.content ?? "";
}

export async function runMentor(
  messages: ChatMessage[],
  apiKey: string,
): Promise<MentorResponse> {
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const query = lastUserMessage?.content ?? "";

  const chunks = await retrieveRelevantChunks(query, apiKey);
  const systemPrompt = buildSystemPrompt(chunks);
  const reply = await callOpenAI(messages, systemPrompt, apiKey);

  return {
    reply,
    sources: chunks.map((c) => ({
      title: c.title,
      sourceUrl: c.sourceUrl,
      score: c.score,
    })),
  };
}

export async function* runMentorStream(
  messages: ChatMessage[],
  apiKey: string,
): AsyncGenerator<{ type: "chunk"; content: string } | { type: "done"; sources: MentorResponse["sources"] }> {
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const query = lastUserMessage?.content ?? "";

  const chunks = await retrieveRelevantChunks(query, apiKey);
  const systemPrompt = buildSystemPrompt(chunks);

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${body}`);
  }

  if (!response.body) {
    throw new Error("OpenAI response has no body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;
      const payload = trimmed.slice(6);
      if (payload === "[DONE]") {
        yield {
          type: "done",
          sources: chunks.map((c) => ({
            title: c.title,
            sourceUrl: c.sourceUrl,
            score: c.score,
          })),
        };
        return;
      }

      try {
        const parsed = JSON.parse(payload) as {
          choices: Array<{ delta: { content?: string } }>;
        };
        const content = parsed.choices[0]?.delta?.content;
        if (content) yield { type: "chunk", content };
      } catch {
        // skip malformed
      }
    }
  }

  yield {
    type: "done",
    sources: chunks.map((c) => ({
      title: c.title,
      sourceUrl: c.sourceUrl,
      score: c.score,
    })),
  };
}
