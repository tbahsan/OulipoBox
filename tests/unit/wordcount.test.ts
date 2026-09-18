import { describe, expect, it } from 'vitest';
import { validateWordCount } from '../../src/engine/wordcount';

describe('validateWordCount', () => {
  it('validates exact word count target', () => {
    const text = 'One two three four five six.';
    const result = validateWordCount(text, { mode: 'exact', target: 6 });

    expect(result.valid).toBe(true);
    expect(result.violations.length).toBe(0);
    expect(result.summary).toContain('Exactly 6 words written');
  });

  it('reports shortfall when under target', () => {
    const text = 'One two three.';
    const result = validateWordCount(text, { mode: 'exact', target: 6 });

    expect(result.valid).toBe(false);
    expect(result.summary).toContain('3 / 6 words. Need 3 more words.');
  });

  it('flags overflowing words when exceeding exact target', () => {
    const text = 'One two three four five six seven eight.';
    const result = validateWordCount(text, { mode: 'exact', target: 6 });

    expect(result.valid).toBe(false);
    expect(result.violations.length).toBe(2); // 'seven', 'eight'
    expect(result.violations[0].word).toBe('seven');
    expect(result.violations[1].word).toBe('eight');
  });

  it('validates min and max range targets', () => {
    const text = 'A quick red fox jumps high.';
    const resultInRange = validateWordCount(text, { mode: 'range', target: 10, min: 4, max: 10 });
    expect(resultInRange.valid).toBe(true);

    const resultTooShort = validateWordCount(text, { mode: 'range', target: 10, min: 10, max: 20 });
    expect(resultTooShort.valid).toBe(false);
  });
});
