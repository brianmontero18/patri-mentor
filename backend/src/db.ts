/**
 * SQLite Database Layer
 *
 * Phase 1: users + conversations only.
 * Phase 3 (future): add knowledge_chunks for RAG.
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
      `CREATE TABLE IF NOT EXISTS conversations (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id    TEXT,
        role       TEXT NOT NULL,
        content    TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
    ],
    "write",
  );
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

// ─── Conversations ───────────────────────────────────────────────────────────

export async function saveMessage(
  userId: string | null,
  role: string,
  content: string,
): Promise<void> {
  await client.execute({
    sql: "INSERT INTO conversations (user_id, role, content) VALUES (?, ?, ?)",
    args: [userId, role, content],
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
