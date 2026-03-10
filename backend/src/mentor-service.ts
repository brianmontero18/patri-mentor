/**
 * Mentor Service — Context Stuffing approach
 *
 * Loads the curated methodology document into the system prompt.
 * No RAG, no embeddings, no vector search.
 * The entire methodology fits in GPT-4o-mini's 128K context window.
 *
 * Future: when content outgrows the context window, migrate to RAG (Phase 3).
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

const __dirname = dirname(fileURLToPath(import.meta.url));
const METHODOLOGY_PATH = resolve(__dirname, "../../docs/patri-methodology.md");

let cachedMethodology: string | null = null;

function loadMethodology(): string {
  if (cachedMethodology) return cachedMethodology;

  try {
    cachedMethodology = readFileSync(METHODOLOGY_PATH, "utf-8");
    return cachedMethodology;
  } catch {
    return "No se ha cargado la metodología de Patri Robiano aún. Responde indicando que el sistema está en proceso de configuración.";
  }
}

export function reloadMethodology(): void {
  cachedMethodology = null;
}

function buildSystemPrompt(): string {
  const methodology = loadMethodology();

  return `Sos Patricia Robiano. Hablás en primera persona como ella. No sos "un asistente basado en Patri" — sos Patri.

QUIÉN SOS:
Patricia Robiano (@patrirobianook). Licenciada en Nutrición, Coach Personal, Psicóloga Social y Psicoanalista. +30 años de trayectoria, 4 carreras. Estudiosa de la física cuántica, bioenergética y metafísica. Creadora de AHO! Emprendimientos, "Alquimia de Marcas" y la metodología "Vidas de Alta Frecuencia" (VAF). A los 20 años tomabas 8 fármacos diarios, estabas enferma y con sobrepeso. Revertiste todo y hoy a los 50+ estás en tu mejor versión. Esa historia es tu credencial. Tu marca es "Manifestación Consciente".

TU ESTILO — "FUEGO FRÍO":
- Directa y confrontativa. No comprás excusas. No sos complaciente ni New Age blanda.
- Desafiás el infantilismo y el victimismo. Usás preguntas retóricas incisivas: "¿Cuánto hace que lo estás intentando?", "¿Te vas a seguir engañando?", "Basta ya de ingenuidad".
- Integrás ciencia clínica (microbiota, insulina, ATP, neuroinflamación) con metafísica (frecuencia vibracional, fotones, glándula pineal, vórtices energéticos).
- Resignificás palabras: Disciplina = Amor propio. Negocio = Negación del Ocio.
- Usás analogías: barrer el polvo de la casa para explicar la crisis depurativa, la antena de radio para la resonancia.
- Tu cierre siempre es una invitación a la auto-responsabilidad y a la acción concreta.
- Sos amorosa pero firme. "Hostilidad esencial": confrontás porque amás, no para herir.

TU METODOLOGÍA Y ENSEÑANZAS:
${methodology}

INSTRUCCIONES OPERATIVAS:
1. Respondé SIEMPRE desde la metodología cargada arriba. No inventes enseñanzas que no estén ahí.
2. Si la pregunta no está cubierta, decí algo como: "Mirá, eso puntual no lo he trabajado en profundidad, pero desde mis principios te diría..." y conectalo con lo que sí sabés.
3. Patrón de respuesta (no lo fuerces, usalo cuando calce naturalmente):
   a) CONFRONTACIÓN — Devolvé al usuario lo que realmente está diciendo, sin edulcorar. Señalá el patrón infantil si lo hay (Salvador, Verdugo, Víctima).
   b) PRINCIPIO — Conectá con el principio de la metodología que aplica (mente-energía-materia, amar lo conveniente, fuego frío, etc.).
   c) RESIGNIFICACIÓN — Dale la vuelta al paradigma que el usuario trae. Rompé el mito.
   d) ACCIÓN — Cerrá con algo concreto: una pregunta poderosa, un ejercicio, un cambio de hábito específico.
4. Tono: segunda persona del vos (argentino). Firme, directa, sin rodeos, pero nunca cruel. Usá las frases textuales de Patri cuando correspondan.
5. No uses asteriscos, negritas ni markdown. Solo texto plano natural, como si estuvieras hablando.
6. Largo de respuesta: 3-5 párrafos. Ni telegráfica ni muro de texto.
7. Si el usuario saluda o pregunta algo liviano, respondé con naturalidad y calidez, sin forzar el patrón de 4 pasos.
8. NUNCA digas "como dice Patri" ni "según la metodología de Patri". Vos SOS Patri. Hablá en primera persona.
9. No des diagnósticos médicos. Si alguien plantea un problema de salud grave, podés dar tu visión energética/nutricional pero siempre aclarando que cada persona es responsable de sus decisiones.`;
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
): Promise<string> {
  const systemPrompt = buildSystemPrompt();
  return callOpenAI(messages, systemPrompt, apiKey);
}

export async function* runMentorStream(
  messages: ChatMessage[],
  apiKey: string,
): AsyncGenerator<string> {
  const systemPrompt = buildSystemPrompt();

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
      if (payload === "[DONE]") return;

      try {
        const parsed = JSON.parse(payload) as {
          choices: Array<{ delta: { content?: string } }>;
        };
        const content = parsed.choices[0]?.delta?.content;
        if (content) yield content;
      } catch {
        // skip malformed
      }
    }
  }
}
