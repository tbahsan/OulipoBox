import { describe, expect, it } from 'vitest';
import { validateLipogram } from '../../src/engine/lipogram';

describe('validateLipogram', () => {
  it('passes on text containing zero forbidden letters', () => {
    const text = 'A stout wild wolf runs past our farm.';
    const result = validateLipogram(text, { forbiddenLetters: ['e'] });

    expect(result.valid).toBe(true);
    expect(result.violations.length).toBe(0);
    expect(result.summary).toContain('Strict Lipogram achieved');
  });

  it('flags forbidden letter with exact coordinates', () => {
    const text = 'The quick brown fox.';
    const result = validateLipogram(text, { forbiddenLetters: ['e'] });

    expect(result.valid).toBe(false);
    expect(result.violations.length).toBe(1);
    expect(result.violations[0].start).toBe(2); // 'T-h-e' -> index 2
    expect(result.violations[0].char).toBe('e');
    expect(result.violations[0].word).toBe('The');
    expect(result.violations[0].line).toBe(1);
  });

  it('handles multiple forbidden letters simultaneously', () => {
    const text = 'Cat sat on the mat.';
    const result = validateLipogram(text, { forbiddenLetters: ['t', 's'] });

    expect(result.valid).toBe(false);
    // Ca[t] [s]a[t] on [t]he ma[t] -> 5 violations
    expect(result.violations.length).toBe(5);
  });

  it('is case-insensitive and flags accented forms', () => {
    const text = 'Café and Éclair.';
    const result = validateLipogram(text, { forbiddenLetters: ['e'] });

    expect(result.valid).toBe(false);
    expect(result.violations.length).toBe(2); // 'é' in Café and 'É' in Éclair
  });

  it('preserves user text immutability (returns coordinates only)', () => {
    const input = 'Never delete what the user wrote!';
    const result = validateLipogram(input, { forbiddenLetters: ['e'] });

    expect(result.violations.length).toBe(8);
    // All coordinates must be within the length of the string
    for (const v of result.violations) {
      expect(v.start).toBeGreaterThanOrEqual(0);
      expect(v.end).toBeLessThanOrEqual(input.length);
      expect(input.slice(v.start, v.end).toLowerCase().normalize('NFD')).toContain('e');
    }
  });
});
