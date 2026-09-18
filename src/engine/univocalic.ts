import { UnivocalicConfig, ValidationResult, Violation } from './types';
import { calculateStats, extractWords, isAsciiLetter, stripDiacritics } from './text-utils';

const STANDARD_VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

export function validateUnivocalic(text: string, config: UnivocalicConfig): ValidationResult {
  const stats = calculateStats(text);
  const violations: Violation[] = [];
  const allowed = config.allowedVowel.toLowerCase();
  const treatY = config.treatYAsVowel ?? false;

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
    if (!isAsciiLetter(baseChar)) continue;

    let isForbiddenVowel = false;
    if (STANDARD_VOWELS.has(baseChar) && baseChar !== allowed) {
      isForbiddenVowel = true;
    } else if (treatY && baseChar === 'y' && allowed !== 'y') {
      isForbiddenVowel = true;
    }

    if (isForbiddenVowel) {
      const parentWord = wordMap.get(i);
      violations.push({
        start: i,
        end: i + 1,
        message: `Vowel '${rawChar}' is forbidden. Only vowel '${allowed.toUpperCase()}' is permitted.`,
        severity: 'error',
        char: rawChar,
        word: parentWord?.raw,
        line: parentWord?.line || lineCounter,
      });
    }
  }

  const yNote = treatY ? ' (Y counted as vowel)' : ' (Y treated as consonant)';
  const summary =
    violations.length === 0
      ? `Univocalic compliant! Only vowel '${allowed.toUpperCase()}' is used${yNote}.`
      : `Found ${violations.length} unauthorized vowel ${violations.length === 1 ? 'instance' : 'instances'}${yNote}.`;

  return {
    valid: violations.length === 0,
    constraintType: 'univocalic',
    violations,
    summary,
    stats,
  };
}
