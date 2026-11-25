// Fortune Cookie for the Liquidated Trader — one-line fortune writer.
//
// Writes a single original fortune cookie line (at most 20 words, plain
// text) for a crypto trader who has just been liquidated, to
// /output/entry.txt. Node 22, standard library only.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The fortune: oracular on the way in, rueful on the way out. The stars
// promise a recovery, then quietly admit it belongs to somebody else's
// portfolio, in somebody else's lifetime.
const FORTUNE =
  "The stars insist your portfolio will recover, just not this portfolio, and not in this lifetime.";

const MAX_WORDS = 20;
const MAX_CHARS = 160;

function wordCount(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

function main(): void {
  const text = FORTUNE.trim();

  if (text.length === 0 || text.includes("\n")) {
    throw new Error("fortune must be exactly one non-empty line");
  }
  const words = wordCount(text);
  if (words > MAX_WORDS) {
    throw new Error(`fortune is ${words} words, over the ${MAX_WORDS}-word limit`);
  }
  if (text.length > MAX_CHARS) {
    throw new Error(`fortune is ${text.length} chars, over the ${MAX_CHARS}-char gate`);
  }

  const outDir = "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, text, "utf8");

  // Read it back: the file the judge sees must be exactly this one line.
  const written = readFileSync(outPath, "utf8");
  if (written !== text) {
    throw new Error("entry.txt round-trip mismatch");
  }
  console.log(`wrote ${text.length} chars, ${words} words, to ${outPath}`);
}

main();
