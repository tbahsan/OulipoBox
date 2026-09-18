import { describe, expect, it } from 'vitest';
import { validateUnivocalic } from '../../src/engine/univocalic';

describe('validateUnivocalic', () => {
  it('passes when only the permitted vowel is used', () => {
    const text = 'The green trees weep. Sweet breezes meet the deep red beets.';
    const result = validateUnivocalic(text, { allowedVowel: 'e' });

    expect(result.valid).toBe(true);
    expect(result.violations.length).toBe(0);
    expect(result.summary).toContain("Only vowel 'E' is used");
  });

  it('treats Y as a consonant by default per roadmap policy', () => {
    // "dry", "my", "fly" have no standard vowels (a,e,i,o,u)
    const text = 'Dry sly spy.';
    const result = validateUnivocalic(text, { allowedVowel: 'e', treatYAsVowel: false });

    expect(result.valid).toBe(true);
    expect(result.violations.length).toBe(0);
  });

  it('flags unauthorized vowels with descriptive message', () => {
    const text = 'The cat ran.';
    const result = validateUnivocalic(text, { allowedVowel: 'e' });

    expect(result.valid).toBe(false);
    // 'a' in 'cat', 'a' in 'ran' -> 2 violations
    expect(result.violations.length).toBe(2);
    expect(result.violations[0].char).toBe('a');
    expect(result.violations[0].word).toBe('cat');
  });

  it('flags Y if user explicitly enables treatYAsVowel', () => {
    const text = 'My sly fly.';
    const result = validateUnivocalic(text, { allowedVowel: 'e', treatYAsVowel: true });

    expect(result.valid).toBe(false);
    expect(result.violations.length).toBe(3);
  });
});
