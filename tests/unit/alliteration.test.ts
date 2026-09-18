import { describe, expect, it } from 'vitest';
import { validateAlliteration } from '../../src/engine/alliteration';

describe('validateAlliteration', () => {
  it('passes when every word begins with the target letter', () => {
    const text = 'Peter Piper picked pickled peppers.';
    const result = validateAlliteration(text, { targetLetter: 'p' });

    expect(result.valid).toBe(true);
    expect(result.violations.length).toBe(0);
    expect(result.summary).toContain('Flawless Tautogram');
  });

  it('flags words starting with different letters', () => {
    const text = 'Peter baked pickled peppers.';
    const result = validateAlliteration(text, { targetLetter: 'p' });

    expect(result.valid).toBe(false);
    expect(result.violations.length).toBe(1);
    expect(result.violations[0].word).toBe('baked');
    expect(result.violations[0].message).toContain("begins with 'b' (expected 'P')");
  });

  it('handles punctuation and whitespace cleanly', () => {
    const text = '"Patient, passionate poets..."';
    const result = validateAlliteration(text, { targetLetter: 'p' });

    expect(result.valid).toBe(true);
    expect(result.violations.length).toBe(0);
  });
});
