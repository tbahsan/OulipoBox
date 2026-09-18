import { MonosyllabicConfig, ValidationResult, Violation } from './types';
import { calculateStats, extractWords, stripDiacritics } from './text-utils';

// Curated lookup for words where algorithmic rules may fail
const KNOWN_SYLLABLES: Record<string, number> = {
  the: 1, a: 1, an: 1, and: 1, or: 1, but: 1, if: 1, in: 1, on: 1, at: 1,
  to: 1, for: 1, with: 1, from: 1, by: 1, of: 1, off: 1, up: 1, out: 1,
  as: 1, so: 1, no: 1, not: 1, yes: 1, do: 1, does: 1, done: 1, did: 1,
  is: 1, am: 1, are: 1, was: 1, were: 1, be: 1, been: 1, being: 2,
  have: 1, has: 1, had: 1, having: 2, will: 1, would: 1, shall: 1, should: 1,
  can: 1, could: 1, may: 1, might: 1, must: 1,
  i: 1, you: 1, he: 1, she: 1, it: 1, we: 1, they: 1,
  me: 1, him: 1, her: 1, us: 1, them: 1,
  my: 1, your: 1, his: 1, its: 1, our: 1, their: 1,
  this: 1, that: 1, these: 1, those: 1,
  who: 1, what: 1, when: 1, where: 1, why: 1, how: 1, which: 1,
  one: 1, two: 1, three: 1, four: 1, five: 1, six: 1, seven: 2, eight: 1, nine: 1, ten: 1,
  poem: 2, poet: 2, poetry: 3, lion: 2, iron: 2, chaos: 2, rhythm: 2,
  quiet: 2, naive: 2, idea: 3, video: 3, radio: 2, area: 3,
  create: 2, created: 3, fire: 1, wire: 1, tire: 1, hire: 1,
  ourself: 2, through: 1, though: 1, thought: 1, bough: 1, rough: 1, tough: 1,
  people: 2, little: 2, water: 2, over: 2, under: 2, after: 2, before: 2,
};

/**
 * Estimates the syllable count of an English word.
 */
export function countSyllables(rawWord: string): number {
  const word = stripDiacritics(rawWord.toLowerCase()).replace(/[^a-z]/g, '');
  if (!word) return 0;
  if (word.length <= 3) return 1;

  if (KNOWN_SYLLABLES[word] !== undefined) {
    return KNOWN_SYLLABLES[word];
  }

  let count = 0;
  const vowels = 'aeiouy';
  let prevIsVowel = false;

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !prevIsVowel) {
      count++;
    }
    prevIsVowel = isVowel;
  }

  // Adjust for silent 'e' at end
  if (word.endsWith('e') && !word.endsWith('le')) {
    count--;
  }

  // Adjust for -ed ending (walked vs waited)
  if (word.endsWith('ed') && !word.endsWith('ted') && !word.endsWith('ded')) {
    count--;
  }

  // Double vowels forming hiatus (e.g. "ia", "eo", "io", "ua")
  const hiatusMatches = word.match(/(?:ia|eo|io|ua|ue|ui)/g);
  if (hiatusMatches) {
    // If adjacent vowels were merged in the simple counter, give back appropriate syllables
    // Handled conservatively
  }

  return Math.max(1, count);
}

export function validateMonosyllabic(text: string, _config?: MonosyllabicConfig): ValidationResult {
  const stats = calculateStats(text);
  const words = extractWords(text);
  const violations: Violation[] = [];

  for (const w of words) {
    const syllables = countSyllables(w.clean);
    if (syllables > 1) {
      violations.push({
        start: w.start,
        end: w.end,
        message: `"${w.raw}" has ${syllables} syllables (must be 1 syllable)`,
        severity: 'error',
        word: w.raw,
        line: w.line,
      });
    }
  }

  const summary =
    words.length === 0
      ? 'Write text where every word has exactly one syllable.'
      : violations.length === 0
        ? `Monosyllabic success! All ${words.length} words are strictly single-syllable.`
        : `Found ${violations.length} polysyllabic ${violations.length === 1 ? 'word' : 'words'} (exceeds 1 syllable).`;

  return {
    valid: words.length > 0 && violations.length === 0,
    constraintType: 'monosyllabic',
    violations,
    summary,
    stats,
  };
}
