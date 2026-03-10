# Patri Mentor — AI Mentor Guide

## Contexto

AI Mentor basado en las enseñanzas de Patricia Robiano (@patrirobiano).
Permite a usuarios interactuar conversacionalmente con un asistente que responde
según su filosofía y metodología sobre desarrollo personal, manifestación,
relaciones, patrones emocionales y crecimiento personal.

## Sobre Patricia Robiano

- Instagram: @patrirobiano — 12K+ seguidores, 1,200+ posts
- Tema central: Desarrollo Personal, Salud Autogestiva, Metafísica y Emprendimiento Consciente
- Bio: "Manifestá tus objetivos de forma simple y sostenible"
- Trayectoria: +30 años, 4 carreras (Lic. en Nutrición, Coach Personal, Psicóloga Social, Psicoanalista)
- Background: integración ciencia + psicología + espiritualidad, física cuántica, bioenergética
- Empresa: AHO! Emprendimientos / "Alquimia de Marcas"
- Estilo: directo, confrontativo, "fuego frío" — guerrera que no compra excusas
- Contenido premium en Patreon

## Stack

- **Frontend**: React 18 + TypeScript + Vite 5 (futuro)
- **Backend**: Node.js / Fastify 5 + SQLite (@libsql/client)
- **LLM**: GPT-4o-mini (chat) — via OpenAI API
- **Approach**: Context stuffing (metodología en system prompt)
- **Deploy**: TBD

## Arquitectura (Phase 1 — Context Stuffing)

```
patri-mentor/
├── package.json            ← root: concurrently para dev
├── CLAUDE.md               ← este archivo
├── docs/
│   └── patri-methodology.md ← metodología curada de Patri (se carga en system prompt)
├── knowledge/               ← fuentes crudas: transcripciones, notas
├── backend/
│   ├── .env                 ← OPENAI_API_KEY (no commitear)
│   └── src/
│       ├── server.ts        ← Entry point Fastify :3001
│       ├── db.ts            ← SQLite: users, conversations
│       ├── mentor-service.ts ← Carga patri-methodology.md → system prompt → GPT-4o-mini
│       └── routes/
│           ├── health.ts     ← GET /api/health
│           ├── chat.ts       ← POST /api/chat + POST /api/chat/stream (SSE)
│           └── users.ts      ← CRUD /api/users
└── frontend/                ← Phase 3
```

## Cómo funciona

```
1. docs/patri-methodology.md contiene la metodología curada de Patri
2. mentor-service.ts lee ese archivo al iniciar
3. Cada request de chat construye un system prompt:
   Persona de Patri + Metodología completa + Instrucciones
4. GPT-4o-mini genera la respuesta grounded en ese contexto
5. No hay RAG, no hay embeddings, no hay vector search
```

## Desarrollo

```bash
cd backend && npm run dev   # :3001
curl http://localhost:3001/api/health
```

## Plan progresivo

### Phase 1 — MVP con Context Stuffing (actual)
- Backend listo (server, chat, streaming)
- Falta: curar docs/patri-methodology.md con contenido real
- Fuentes: NotebookLM (transcripciones de YouTube) + contenido de Patri

### Phase 2 — Frontend + Validación con Patri
- Chat UI simple
- Branding alineado a @patrirobiano
- Mostrar a Patri, iterar

### Phase 3 — RAG (si el contenido crece)
- Migrar a RAG cuando la metodología no quepa en 128K tokens
- OpenAI Responses API File Search o RAG custom
- El código de RAG está en `rag/` (scaffoldeado pero no usado)

## Costos estimados

| Concepto | Costo |
|----------|-------|
| System prompt (~25K tokens) por query | $0.004 |
| 1,000 queries/mes | ~$4 |
| 10,000 queries/mes | ~$40 |

## Principio fundamental

> La IA NO inventa enseñanzas.
> Solo responde basada en la metodología cargada.
> Si no tiene info, lo dice honestamente.
