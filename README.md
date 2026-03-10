# Patri Mentor — AI Mentor

AI Mentor basado en las enseñanzas de Patri Roviano.
Permite consultar su metodología sobre relaciones, patrones emocionales,
dinámicas familiares y crecimiento personal en tiempo real.

## Quick Start

```bash
# 1. Instalar dependencias
cd backend && npm install && cd ..
npm install

# 2. Configurar API key
cp backend/.env.example backend/.env
# Editar backend/.env con tu OPENAI_API_KEY

# 3. Ingestar conocimiento (ejemplo)
cd backend
npm run ingest -- --file ../knowledge/sample.txt --title "Ejemplo" --type notes

# 4. Levantar servidor
cd ..
npm run dev
# Backend: http://localhost:3001
# GET http://localhost:3001/api/health

# 5. Probar chat
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Tengo un conflicto con mi hermana"}]}'
```

## Arquitectura

```
Usuario → Chat API → RAG Retriever → Knowledge Chunks (SQLite)
                         ↓
                   Top-K chunks relevantes
                         ↓
                   System Prompt (Persona Patri + Contexto)
                         ↓
                   GPT-4o-mini → Respuesta grounded
```

## Ingesta de conocimiento

```bash
# Archivo individual
npm run ingest -- --file path/to/transcript.txt --title "Nombre del video" --type transcript

# Directorio completo
npm run ingest -- --dir path/to/transcripts/ --type transcript

# Tipos: transcript | article | book | notes | podcast
```

## API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Healthcheck |
| POST | `/api/chat` | Chat sync con RAG |
| POST | `/api/chat/stream` | Chat SSE streaming con RAG |
| POST | `/api/knowledge/ingest` | Ingestar contenido vía API |
| GET | `/api/knowledge` | Listar fuentes de conocimiento |
| DELETE | `/api/knowledge/:sourceId` | Eliminar fuente |
| POST | `/api/users` | Crear usuario |
| GET | `/api/users/:id` | Obtener usuario |

## Stack

- **Backend**: Fastify 5 + TypeScript + SQLite (@libsql/client)
- **LLM**: GPT-4o-mini vía OpenAI API
- **Embeddings**: text-embedding-3-small
- **Vector Search**: Cosine similarity en memoria (MVP)
- **Frontend**: TBD (React + Vite)
