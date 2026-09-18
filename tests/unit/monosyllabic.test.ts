import { describe, expect, it } from 'vitest';
import { countSyllables, validateMonosyllabic } from '../../src/engine/monosyllabic';

describe('validateMonosyllabic & countSyllables', () => {
  it('correctly counts single-syllable common English words', () => {
    expect(countSyllables('the')).toBe(1);
    expect(countSyllables('cat')).toBe(1);
    expect(countSyllables('sat')).toBe(1);
    expect(countSyllables('on')).toBe(1);
    expect(countSyllables('mat')).toBe(1);
    expect(countSyllables('light')).toBe(1);
    expect(countSyllables('warm')).toBe(1);
    expect(countSyllables('through')).toBe(1);
    expect(countSyllables('thought')).toBe(1);
  });

  it('correctly identifies multi-syllable words', () => {
    expect(countSyllables('water')).toBe(2);
    expect(countSyllables('little')).toBe(2);
    expect(countSyllables('poetry')).toBe(3);
    expect(countSyllables('quiet')).toBe(2);
    expect(countSyllables('created')).toBe(3);
  });

  it('validates a strictly monosyllabic passage', () => {
    const text = 'The sun rose high and gave warm light to all the land.';
    const result = validateMonosyllabic(text);

    expect(result.valid).toBe(true);
    expect(result.violations.length).toBe(0);
    expect(result.summary).toContain('Monosyllabic success');
  });

  it('flags polysyllabic words in a passage', () => {
    const text = 'The golden sun rose high over quiet waters.';
    const result = validateMonosyllabic(text);

    expect(result.valid).toBe(false);
    // golden (2), over (2), quiet (2), waters (2)
    expect(result.violations.length).toBe(4);
    const flaggedWords = result.violations.map((v) => v.word);
    expect(flaggedWords).toContain('golden');
    expect(flaggedWords).toContain('waters');
  });
});
