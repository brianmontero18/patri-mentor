# Patri Mentor — AI Mentor Guide

## Contexto

AI Mentor basado en las enseñanzas de Patri Roviano.
Permite a usuarios interactuar conversacionalmente con un asistente que responde
según la filosofía, metodología y frameworks de Patri sobre relaciones, patrones
emocionales, dinámicas familiares y crecimiento personal.

El asistente simula cómo Patri Roviano guiaría a alguien cuando presenta un
conflicto personal o situación de vida.

## Stack

- **Frontend**: React 18 + TypeScript + Vite 5
- **Backend**: Node.js / Fastify 5 + SQLite (@libsql/client)
- **LLM**: GPT-4o-mini (chat + RAG reasoning) — via OpenAI API
- **Embeddings**: text-embedding-3-small (OpenAI)
- **Vector Search**: Cosine similarity sobre SQLite (MVP, sin infra externa)
- **Deploy**: TBD (Fly.io o similar)

## Arquitectura

```
patri-mentor/
├── package.json            ← root: concurrently para dev, build, start
├── CLAUDE.md               ← este archivo
├── docs/
│   └── patri-methodology.md ← metodología estructurada de Patri (curada)
├── knowledge/               ← fuentes crudas: transcripciones, notas, etc.
├── backend/
│   ├── .env                 ← OPENAI_API_KEY (no commitear)
│   └── src/
│       ├── server.ts        ← Entry point. Plugins, DB init, rutas bajo /api
│       ├── db.ts            ← SQLite: users, knowledge_chunks, conversations
│       ├── mentor-service.ts ← System prompt Patri + RAG context + LLM
│       ├── rag/
│       │   ├── embeddings.ts ← OpenAI embeddings wrapper
│       │   ├── ingest.ts     ← Chunk + embed content → SQLite
│       │   └── retriever.ts  ← Vector search (cosine similarity)
│       └── routes/
│           ├── health.ts     ← GET /api/health
│           ├── chat.ts       ← POST /api/chat + POST /api/chat/stream (SSE)
│           ├── knowledge.ts  ← CRUD knowledge base + ingest endpoint
│           └── users.ts      ← CRUD /api/users
└── frontend/
    ├── vite.config.ts       ← Proxy /api → localhost:3001
    └── src/
        ├── App.tsx           ← Chat-first UI
        ├── main.tsx          ← Entry point React
        ├── index.css         ← Estilos (branding Patri)
        ├── api.ts            ← Llamadas HTTP
        └── components/
            └── ChatView.tsx   ← Chat conversacional
```

## Desarrollo

```bash
# Desde la raíz (levanta ambos con concurrently)
npm run dev

# O por separado
cd backend && npm run dev   # :3001
cd frontend && npm run dev  # :5174

# Verificar
curl http://localhost:5174/api/health

# Ingestar conocimiento
curl -X POST http://localhost:3001/api/knowledge/ingest \
  -H "Content-Type: application/json" \
  -d '{"title": "...", "source": "...", "content": "...", "type": "transcript"}'
```

## Flujo de datos

```
1. Ingesta de conocimiento:
   POST /api/knowledge/ingest { title, source, content, type }
   → Chunking semántico (split por párrafos, ~500 tokens)
   → OpenAI text-embedding-3-small genera embeddings
   → Almacena chunks + embeddings en SQLite (knowledge_chunks)

2. Chat (streaming):
   POST /api/chat/stream { userId, messages }
   → Toma último mensaje del usuario
   → Genera embedding de la query
   → Busca top-K chunks más relevantes (cosine similarity)
   → Construye system prompt con contexto RAG + personalidad Patri
   → GPT-4o-mini genera respuesta grounded en conocimiento
   → SSE stream de chunks
   → Guarda en conversations

3. Sin userId (anónimo):
   POST /api/chat/stream { messages }
   → Misma lógica pero sin persistencia
```

## API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Healthcheck |
| POST | `/api/chat` | `{ userId?, messages }` → `{ reply, sources }` |
| POST | `/api/chat/stream` | `{ userId?, messages }` → SSE stream |
| POST | `/api/knowledge/ingest` | `{ title, source, content, type }` → ingest + embed |
| GET | `/api/knowledge` | Listar knowledge chunks |
| DELETE | `/api/knowledge/:id` | Eliminar chunk |
| POST | `/api/users` | Crear usuario |
| GET | `/api/users/:id` | Obtener usuario |

## Decisiones técnicas

- **RAG sin infra externa**: MVP usa cosine similarity sobre vectors almacenados en SQLite como JSON. Suficiente para < 10k chunks. Migrar a pgvector/Pinecone si escala.
- **Sin LangChain**: overhead innecesario para el caso. OpenAI API directo + retrieval custom.
- **Embeddings en SQLite**: vector como TEXT (JSON array). Búsqueda en JS. Simple y portable.
- **Chunking por párrafos**: split natural, ~500 tokens por chunk, overlap de 50 tokens.
- **Grounding estricto**: el LLM NO inventa enseñanzas. Solo responde con contexto recuperado.
- **Personalidad fiel**: system prompt calibrado al tono y estilo de Patri Roviano.
- **Puerto 3001**: para no colisionar con Astral (3000).
- **Mismo stack que Astral**: facilita reutilización y mantenimiento.

## Principio fundamental

> La IA NO inventa enseñanzas.
> Todas las respuestas deben estar fundamentadas en conocimiento recuperado.
> Si no hay contexto relevante, lo dice honestamente.

## RAG Pipeline

```
Query del usuario
      │
      ▼
  Embedding (text-embedding-3-small)
      │
      ▼
  Cosine Similarity vs knowledge_chunks
      │
      ▼
  Top-K chunks (k=5)
      │
      ▼
  System Prompt = Persona Patri + Chunks relevantes
      │
      ▼
  GPT-4o-mini genera respuesta grounded
      │
      ▼
  Respuesta al usuario (con referencias)
```

## Patrón de respuesta del mentor

Las respuestas siguen un patrón de mentoría:

1. **Reflejo**: refleja la situación del usuario
2. **Patrón**: identifica el patrón emocional/relacional
3. **Enseñanza**: explica la dinámica según Patri
4. **Guía**: sugiere reflexión o acción

## Roadmap

### Fase 1 — MVP Backend (actual)
- [x] Scaffold proyecto
- [ ] RAG pipeline (embed + retrieve)
- [ ] Knowledge ingestion endpoint
- [ ] Chat endpoint con RAG
- [ ] System prompt alineado a Patri

### Fase 2 — Contenido
- [ ] Investigar fuentes públicas de Patri
- [ ] Transcribir videos clave
- [ ] Curar y estructurar metodología
- [ ] Ingestar knowledge base

### Fase 3 — Frontend
- [ ] Chat UI (similar a Astral)
- [ ] Branding Patri Roviano
- [ ] Onboarding simple

### Fase 4 — Evolución
- [ ] Memoria de usuario (context history)
- [ ] Voz (ElevenLabs)
- [ ] Diagnóstico de situación
- [ ] Tracking de patrones emocionales
