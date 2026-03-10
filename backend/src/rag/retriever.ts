/**
 * Vector retrieval via cosine similarity.
 * Loads all chunks into memory and searches — fine for MVP (<10k chunks).
 * For production: migrate to pgvector or a dedicated vector DB.
 */

import { getAllChunksWithEmbeddings } from "../db.js";
import { generateEmbedding } from "./embeddings.js";

export interface RetrievedChunk {
  id: string;
  title: string;
  content: string;
  sourceUrl: string | null;
  sourceType: string;
  score: number;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function retrieveRelevantChunks(
  query: string,
  apiKey: string,
  topK = 5,
  minScore = 0.3,
): Promise<RetrievedChunk[]> {
  const queryEmbedding = await generateEmbedding(query, apiKey);
  const allChunks = await getAllChunksWithEmbeddings();

  const scored = allChunks.map((chunk) => ({
    ...chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  return scored
    .filter((c) => c.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(({ embedding: _, ...rest }) => rest);
}
