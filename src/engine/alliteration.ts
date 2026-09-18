import { AlliterationConfig, ValidationResult, Violation } from './types';
import { calculateStats, extractWords, isAsciiLetter, stripDiacritics } from './text-utils';

export function validateAlliteration(text: string, config: AlliterationConfig): ValidationResult {
  const stats = calculateStats(text);
  const words = extractWords(text);
  const violations: Violation[] = [];
  const target = stripDiacritics(config.targetLetter.toLowerCase());

  for (const w of words) {
    const firstChar = stripDiacritics(w.raw.charAt(0).toLowerCase());
    if (!isAsciiLetter(firstChar) || firstChar !== target) {
      violations.push({
        start: w.start,
        end: w.end,
        message: `Word "${w.raw}" begins with '${w.raw.charAt(0)}' (expected '${target.toUpperCase()}')`,
        severity: 'error',
        word: w.raw,
        char: w.raw.charAt(0),
        line: w.line,
      });
    }
  }

  const summary =
    words.length === 0
      ? `Write words all beginning with the letter '${target.toUpperCase()}'.`
      : violations.length === 0
        ? `Flawless Tautogram! All ${words.length} words begin with '${target.toUpperCase()}'.`
        : `Found ${violations.length} word ${violations.length === 1 ? 'mismatch' : 'mismatches'} (must begin with '${target.toUpperCase()}').`;

  return {
    valid: words.length > 0 && violations.length === 0,
    constraintType: 'alliteration',
    violations,
    summary,
    stats,
  };
}
