/**
 * Knowledge ingestion pipeline.
 * Takes raw content → chunks → embeddings → SQLite.
 */

import { randomUUID } from "node:crypto";
import { insertChunk } from "../db.js";
import { generateEmbeddings } from "./embeddings.js";

interface IngestInput {
  title: string;
  source: string;
  sourceType: "transcript" | "article" | "book" | "notes" | "podcast";
  content: string;
}

interface IngestResult {
  sourceId: string;
  chunksCreated: number;
}

const CHUNK_SIZE = 1500;
const CHUNK_OVERLAP = 200;

function chunkText(text: string): string[] {
  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    if (current.length + trimmed.length + 2 > CHUNK_SIZE && current.length > 0) {
      chunks.push(current.trim());
      const words = current.split(/\s+/);
      const overlapWords = words.slice(-Math.floor(CHUNK_OVERLAP / 5));
      current = overlapWords.join(" ") + "\n\n" + trimmed;
    } else {
      current += (current ? "\n\n" : "") + trimmed;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  if (chunks.length === 0 && text.trim()) {
    chunks.push(text.trim());
  }

  return chunks;
}

export async function ingestContent(
  input: IngestInput,
  apiKey: string,
): Promise<IngestResult> {
  const sourceId = randomUUID();
  const chunks = chunkText(input.content);

  const embeddings = await generateEmbeddings(
    chunks.map((c) => `${input.title}\n\n${c}`),
    apiKey,
  );

  for (let i = 0; i < chunks.length; i++) {
    await insertChunk({
      sourceId,
      title: input.title,
      sourceUrl: input.source,
      sourceType: input.sourceType,
      content: chunks[i],
      chunkIndex: i,
      embedding: embeddings[i],
    });
  }

  return { sourceId, chunksCreated: chunks.length };
}
