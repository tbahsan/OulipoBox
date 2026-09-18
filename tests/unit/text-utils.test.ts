import { describe, expect, it } from 'vitest';
import {
  calculateStats,
  extractLines,
  extractWords,
  isAsciiLetter,
  stripDiacritics,
} from '../../src/engine/text-utils';

describe('text-utils', () => {
  it('strips accents and diacritics cleanly', () => {
    expect(stripDiacritics('Café')).toBe('Cafe');
    expect(stripDiacritics('naïve')).toBe('naive');
    expect(stripDiacritics('über')).toBe('uber');
    expect(stripDiacritics('año')).toBe('ano');
  });

  it('identifies ASCII letters accurately', () => {
    expect(isAsciiLetter('a')).toBe(true);
    expect(isAsciiLetter('Z')).toBe(true);
    expect(isAsciiLetter('1')).toBe(false);
    expect(isAsciiLetter('!')).toBe(false);
    expect(isAsciiLetter('é')).toBe(false);
  });

  it('extracts words with accurate character offsets and line numbers', () => {
    const text = "Hello world!\nDon't look back.";
    const words = extractWords(text);

    expect(words.length).toBe(5);
    expect(words[0]).toEqual({
      raw: 'Hello',
      clean: 'hello',
      start: 0,
      end: 5,
      line: 1,
    });
    expect(words[1]).toEqual({
      raw: 'world',
      clean: 'world',
      start: 6,
      end: 11,
      line: 1,
    });
    expect(words[2]).toEqual({
      raw: "Don't",
      clean: "don't",
      start: 13,
      end: 18,
      line: 2,
    });
  });

  it('extracts lines and identifies first alphabetic character', () => {
    const text = 'First line\n  Second line\n\n4th line with digit\nFifth line';
    const lines = extractLines(text);

    expect(lines.length).toBe(5);
    expect(lines[0].firstChar?.char).toBe('F');
    expect(lines[1].firstChar?.char).toBe('S');
    expect(lines[2].firstChar).toBeUndefined(); // blank line
    expect(lines[3].firstChar?.char).toBe('T'); // '4th' -> 'T' is first letter
    expect(lines[4].firstChar?.char).toBe('F');
  });

  it('calculates document stats correctly', () => {
    const text = 'Quick brown fox\njumps high.';
    const stats = calculateStats(text);

    expect(stats.wordCount).toBe(5);
    expect(stats.lineCount).toBe(2);
    expect(stats.nonEmptyLineCount).toBe(2);
    expect(stats.vowelCounts.o).toBe(2); // brOwn, fOx
    expect(stats.vowelCounts.u).toBe(2); // qUick, jUmps
  });
});
