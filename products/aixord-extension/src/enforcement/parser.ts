/**
 * Placeholder prompt parser.
 * Later steps will parse AIXORD command blocks, gates, and handoff markers.
 */
export interface ParsedPrompt {
  raw: string;
  commands: string[];
}

export function parsePrompt(raw: string): ParsedPrompt {
  const commands: string[] = [];
  // Minimal detection: lines that look like COMMANDS
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    // Rough heuristic: uppercase words with spaces
    if (/^[A-Z][A-Z0-9 _:-]{2,}$/.test(t)) commands.push(t);
  }
  return { raw, commands };
}
