import { TextStats } from './types';

export interface WordToken {
  raw: string;
  clean: string;
  start: number;
  end: number;
  line: number;
}

export interface LineToken {
  raw: string;
  trimmed: string;
  start: number;
  end: number;
  lineNumber: number; // 1-based
  firstChar?: {
    char: string;
    index: number;
  };
}

/**
 * Strips diacritics using Unicode NFD decomposition:
 * e.g. "é" -> "e", "ü" -> "u", "ñ" -> "n"
 */
export function stripDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Returns true if character is an English ASCII letter (a-z, A-Z)
 */
export function isAsciiLetter(char: string): boolean {
  if (!char || char.length !== 1) return false;
  const code = char.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}

/**
 * Extracts words along with their exact start/end character offsets in the input text.
 * Handles contractions (e.g. "don't") as single words.
 */
export function extractWords(text: string): WordToken[] {
  const words: WordToken[] = [];
  // Matches sequences of alphabetic characters optionally containing internal apostrophes/hyphens
  const regex = /\b[A-Za-z]+(?:['’\-][A-Za-z]+)*\b/gu;
  let match: RegExpExecArray | null;

  let currentLine = 1;
  let lastIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const raw = match[0];
    const end = start + raw.length;

    // Count newlines up to start
    for (let i = lastIndex; i < start; i++) {
      if (text[i] === '\n') currentLine++;
    }
    lastIndex = start;

    words.push({
      raw,
      clean: stripDiacritics(raw).toLowerCase(),
      start,
      end,
      line: currentLine,
    });
  }

  return words;
}

/**
 * Extracts lines along with their exact offsets and identifies the first alphabetic character
 * of each line for acrostic validation.
 */
export function extractLines(text: string): LineToken[] {
  const lines: LineToken[] = [];
  const rawLines = text.split('\n');
  let currentOffset = 0;

  for (let i = 0; i < rawLines.length; i++) {
    const raw = rawLines[i];
    const start = currentOffset;
    const end = start + raw.length;
    const trimmed = raw.trim();

    let firstChar: { char: string; index: number } | undefined;

    // Find the first alphabetic character in this line
    for (let j = 0; j < raw.length; j++) {
      const char = raw[j];
      const baseChar = stripDiacritics(char);
      if (isAsciiLetter(baseChar)) {
        firstChar = {
          char: baseChar.toUpperCase(),
          index: start + j,
        };
        break;
      }
    }

    lines.push({
      raw,
      trimmed,
      start,
      end,
      lineNumber: i + 1,
      firstChar,
    });

    currentOffset = end + 1; // +1 for the newline character
  }

  return lines;
}

/**
 * Calculates comprehensive text statistics for the document.
 */
export function calculateStats(text: string): TextStats {
  const words = extractWords(text);
  const lines = extractLines(text);
  const nonEmptyLines = lines.filter((l) => l.trimmed.length > 0);

  const vowelCounts = { a: 0, e: 0, i: 0, o: 0, u: 0, y: 0 };
  const letterMap: Record<string, number> = {};
  let totalLetters = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i].toLowerCase();
    const base = stripDiacritics(char);
    if (isAsciiLetter(base)) {
      totalLetters++;
      letterMap[base] = (letterMap[base] || 0) + 1;
      if (base in vowelCounts) {
        vowelCounts[base as keyof typeof vowelCounts]++;
      }
    }
  }

  const topLetters = Object.entries(letterMap)
    .sort((a, b) => b[1] - a[1])
    .map(([letter, count]) => ({
      letter: letter.toUpperCase(),
      count,
      percentage: totalLetters > 0 ? Math.round((count / totalLetters) * 1000) / 10 : 0,
    }));

  return {
    charCount: text.length,
    charCountNoSpaces: text.replace(/\s/g, '').length,
    wordCount: words.length,
    lineCount: lines.length,
    nonEmptyLineCount: nonEmptyLines.length,
    vowelCounts,
    topLetters,
  };
}
