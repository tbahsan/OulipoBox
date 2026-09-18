import { LipogramConfig, ValidationResult, Violation } from './types';
import { calculateStats, extractWords, isAsciiLetter, stripDiacritics } from './text-utils';

export function validateLipogram(text: string, config: LipogramConfig): ValidationResult {
  const stats = calculateStats(text);
  const violations: Violation[] = [];

  const forbiddenSet = new Set(
    config.forbiddenLetters.map((l) => stripDiacritics(l.toLowerCase())),
  );

  const words = extractWords(text);
  const wordMap = new Map<number, { raw: string; line: number }>();
  for (const w of words) {
    for (let pos = w.start; pos < w.end; pos++) {
      wordMap.set(pos, { raw: w.raw, line: w.line });
    }
  }

  let lineCounter = 1;
  for (let i = 0; i < text.length; i++) {
    const rawChar = text[i];
    if (rawChar === '\n') {
      lineCounter++;
      continue;
    }

    const baseChar = stripDiacritics(rawChar.toLowerCase());
    if (isAsciiLetter(baseChar) && forbiddenSet.has(baseChar)) {
      const parentWord = wordMap.get(i);
      violations.push({
        start: i,
        end: i + 1,
        message: `Forbidden letter '${rawChar}' appears here`,
        severity: 'error',
        char: rawChar,
        word: parentWord?.raw,
        line: parentWord?.line || lineCounter,
      });
    }
  }

  const forbiddenListStr = Array.from(forbiddenSet)
    .map((l) => `'${l.toUpperCase()}'`)
    .join(', ');

  const summary =
    violations.length === 0
      ? `Strict Lipogram achieved! Zero instances of forbidden letter(s) ${forbiddenListStr}.`
      : `Found ${violations.length} forbidden letter ${violations.length === 1 ? 'instance' : 'instances'} (${forbiddenListStr}).`;

  return {
    valid: violations.length === 0,
    constraintType: 'lipogram',
    violations,
    summary,
    stats,
  };
}
