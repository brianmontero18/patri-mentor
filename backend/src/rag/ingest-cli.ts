/**
 * CLI tool for ingesting knowledge from text files.
 *
 * Usage:
 *   npm run ingest -- --file path/to/transcript.txt --title "Video Title" --type transcript
 *   npm run ingest -- --dir path/to/transcripts/ --type transcript
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join, extname } from "node:path";
import { initDb } from "../db.js";
import { ingestContent } from "./ingest.js";

const args = process.argv.slice(2);

function getArg(name: string): string | undefined {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : undefined;
}

const file = getArg("file");
const dir = getArg("dir");
const title = getArg("title");
const type = (getArg("type") ?? "transcript") as
  | "transcript"
  | "article"
  | "book"
  | "notes"
  | "podcast";
const source = getArg("source") ?? "";
const apiKey = process.env.OPENAI_API_KEY ?? "";

if (!apiKey) {
  console.error("OPENAI_API_KEY required");
  process.exit(1);
}

if (!file && !dir) {
  console.error("Usage: --file <path> or --dir <path>");
  process.exit(1);
}

await initDb();

async function ingestFile(filePath: string, fileTitle: string) {
  const content = readFileSync(filePath, "utf-8");
  if (!content.trim()) {
    console.log(`  Skipping empty file: ${filePath}`);
    return;
  }

  console.log(`  Ingesting: ${fileTitle} (${content.length} chars)...`);
  const result = await ingestContent(
    { title: fileTitle, source, sourceType: type, content },
    apiKey,
  );
  console.log(`  → ${result.chunksCreated} chunks created (sourceId: ${result.sourceId})`);
}

if (file) {
  await ingestFile(file, title ?? basename(file, extname(file)));
} else if (dir) {
  const files = readdirSync(dir).filter((f) =>
    [".txt", ".md", ".text"].includes(extname(f).toLowerCase()),
  );
  console.log(`Found ${files.length} text files in ${dir}`);

  for (const f of files) {
    const filePath = join(dir, f);
    if (!statSync(filePath).isFile()) continue;
    await ingestFile(filePath, basename(f, extname(f)));
  }
}

console.log("\nDone.");
process.exit(0);
