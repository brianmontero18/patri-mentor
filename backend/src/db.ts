/**
 * SQLite Database Layer
 *
 * Tables: users, knowledge_chunks, conversations
 * Vectors stored as JSON text — sufficient for MVP (<10k chunks).
 */

import { createClient, type Client } from "@libsql/client";
import { randomUUID } from "node:crypto";

let client: Client;

export async function initDb(): Promise<void> {
  const url = process.env.DATABASE_URL ?? "file:./patri-mentor.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;
  client = createClient({ url, ...(authToken && { authToken }) });

  await client.batch(
    [
      `CREATE TABLE IF NOT EXISTS users (
        id         TEXT PRIMARY KEY,
        name       TEXT NOT NULL,
        context    TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
      `CREATE TABLE IF NOT EXISTS knowledge_chunks (
        id         TEXT PRIMARY KEY,
        source_id  TEXT NOT NULL,
        title      TEXT NOT NULL,
        source_url TEXT,
        source_type TEXT NOT NULL,
        content    TEXT NOT NULL,
        chunk_index INTEGER NOT NULL DEFAULT 0,
        embedding  TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
      `CREATE INDEX IF NOT EXISTS idx_chunks_source ON knowledge_chunks(source_id)`,
      `CREATE TABLE IF NOT EXISTS conversations (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id    TEXT,
        role       TEXT NOT NULL,
        content    TEXT NOT NULL,
        sources    TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
    ],
    "write",
  );
}

export function getClient(): Client {
  return client;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function createUser(name: string): Promise<string> {
  const id = randomUUID();
  await client.execute({
    sql: "INSERT INTO users (id, name) VALUES (?, ?)",
    args: [id, name],
  });
  return id;
}

export async function getUser(id: string) {
  const result = await client.execute({
    sql: "SELECT * FROM users WHERE id = ?",
    args: [id],
  });
  const row = result.rows[0];
  if (!row) return undefined;
  return {
    id: row.id as string,
    name: row.name as string,
    context: JSON.parse(row.context as string),
    createdAt: row.created_at as string,
  };
}

// ─── Knowledge Chunks ────────────────────────────────────────────────────────

export async function insertChunk(chunk: {
  sourceId: string;
  title: string;
  sourceUrl?: string;
  sourceType: string;
  content: string;
  chunkIndex: number;
  embedding: number[];
}): Promise<string> {
  const id = randomUUID();
  await client.execute({
    sql: `INSERT INTO knowledge_chunks (id, source_id, title, source_url, source_type, content, chunk_index, embedding)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      chunk.sourceId,
      chunk.title,
      chunk.sourceUrl ?? null,
      chunk.sourceType,
      chunk.content,
      chunk.chunkIndex,
      JSON.stringify(chunk.embedding),
    ],
  });
  return id;
}

export async function getAllChunksWithEmbeddings(): Promise<
  Array<{
    id: string;
    title: string;
    content: string;
    sourceUrl: string | null;
    sourceType: string;
    embedding: number[];
  }>
> {
  const result = await client.execute(
    "SELECT id, title, content, source_url, source_type, embedding FROM knowledge_chunks WHERE embedding IS NOT NULL",
  );
  return result.rows.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    content: row.content as string,
    sourceUrl: row.source_url as string | null,
    sourceType: row.source_type as string,
    embedding: JSON.parse(row.embedding as string),
  }));
}

export async function listKnowledgeSources(): Promise<
  Array<{ sourceId: string; title: string; sourceType: string; chunkCount: number }>
> {
  const result = await client.execute(
    `SELECT source_id, title, source_type, COUNT(*) as chunk_count
     FROM knowledge_chunks
     GROUP BY source_id
     ORDER BY MIN(created_at) DESC`,
  );
  return result.rows.map((row) => ({
    sourceId: row.source_id as string,
    title: row.title as string,
    sourceType: row.source_type as string,
    chunkCount: row.chunk_count as number,
  }));
}

export async function deleteKnowledgeSource(sourceId: string): Promise<number> {
  const result = await client.execute({
    sql: "DELETE FROM knowledge_chunks WHERE source_id = ?",
    args: [sourceId],
  });
  return result.rowsAffected;
}

// ─── Conversations ───────────────────────────────────────────────────────────

export async function saveMessage(
  userId: string | null,
  role: string,
  content: string,
  sources?: string[],
): Promise<void> {
  await client.execute({
    sql: "INSERT INTO conversations (user_id, role, content, sources) VALUES (?, ?, ?, ?)",
    args: [userId, role, content, sources ? JSON.stringify(sources) : null],
  });
}

export async function getConversationHistory(
  userId: string,
  limit = 20,
): Promise<Array<{ role: string; content: string; createdAt: string }>> {
  const result = await client.execute({
    sql: "SELECT role, content, created_at FROM conversations WHERE user_id = ? ORDER BY id DESC LIMIT ?",
    args: [userId, limit],
  });
  return result.rows
    .map((row) => ({
      role: row.role as string,
      content: row.content as string,
      createdAt: row.created_at as string,
    }))
    .reverse();
}
