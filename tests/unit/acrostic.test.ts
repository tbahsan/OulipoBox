import { describe, expect, it } from 'vitest';
import { validateAcrostic } from '../../src/engine/acrostic';

describe('validateAcrostic', () => {
  it('validates a compliant acrostic matching target word letters', () => {
    const text = 'Sun shines bright,\nUp in the sky,\nNow daylight fades.';
    const result = validateAcrostic(text, { targetWord: 'SUN' });

    expect(result.valid).toBe(true);
    expect(result.violations.length).toBe(0);
    expect(result.summary).toContain('All 3 lines spell out "SUN"');
  });

  it('skips empty/blank stanza separation lines gracefully', () => {
    const text = 'Sun shines bright,\n\nUp in the sky,\n\nNow daylight fades.';
    const result = validateAcrostic(text, { targetWord: 'SUN' });

    expect(result.valid).toBe(true);
    expect(result.violations.length).toBe(0);
  });

  it('flags incorrect starting letters with line numbers and expected character', () => {
    const text = 'Sun shines bright,\nMoon glows soft,\nNow daylight fades.';
    const result = validateAcrostic(text, { targetWord: 'SUN' });

    expect(result.valid).toBe(false);
    expect(result.violations.length).toBe(1);
    expect(result.violations[0].line).toBe(2);
    expect(result.violations[0].message).toContain("begins with 'M', but expected 'U'");
  });

  it('reports progress when lines are incomplete', () => {
    const text = 'Sun shines bright,\nUp in the sky.';
    const result = validateAcrostic(text, { targetWord: 'SUN' });

    expect(result.valid).toBe(false);
    expect(result.summary).toContain('2 of 3 lines written');
    expect(result.summary).toContain('Still need 1 more line');
  });

  it('warns when extra lines exceed target acrostic word length', () => {
    const text = 'Sun shines bright,\nUp in the sky,\nNow daylight fades,\nStars appear now.';
    const result = validateAcrostic(text, { targetWord: 'SUN' });

    expect(result.valid).toBe(false);
    expect(result.violations.length).toBe(1);
    expect(result.violations[0].message).toContain('exceeds the target acrostic length');
  });
});
