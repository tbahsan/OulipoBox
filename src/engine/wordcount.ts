import { ValidationResult, Violation, WordCountConfig } from './types';
import { calculateStats, extractWords } from './text-utils';

export function validateWordCount(text: string, config: WordCountConfig): ValidationResult {
  const stats = calculateStats(text);
  const words = extractWords(text);
  const violations: Violation[] = [];
  const currentCount = words.length;

  let isValid = false;
  let summary = '';

  switch (config.mode) {
    case 'exact': {
      const target = config.target;
      if (currentCount === target) {
        isValid = true;
        summary = `Target reached! Exactly ${target} words written.`;
      } else if (currentCount < target) {
        isValid = false;
        const diff = target - currentCount;
        summary = `${currentCount} / ${target} words. Need ${diff} more ${diff === 1 ? 'word' : 'words'}.`;
      } else {
        isValid = false;
        const excess = currentCount - target;
        summary = `${currentCount} / ${target} words. Exceeds target by ${excess} ${excess === 1 ? 'word' : 'words'}.`;
        // Flag words beyond target count
        for (let i = target; i < words.length; i++) {
          const w = words[i];
          violations.push({
            start: w.start,
            end: w.end,
            message: `Word #${i + 1} ("${w.raw}") exceeds the exact ${target}-word limit`,
            severity: 'error',
            word: w.raw,
            line: w.line,
          });
        }
      }
      break;
    }

    case 'min': {
      const min = config.min ?? config.target;
      if (currentCount >= min) {
        isValid = true;
        summary = `Goal reached! ${currentCount} words written (minimum required: ${min}).`;
      } else {
        isValid = false;
        const diff = min - currentCount;
        summary = `${currentCount} / ${min} words. Need at least ${diff} more ${diff === 1 ? 'word' : 'words'}.`;
      }
      break;
    }

    case 'max': {
      const max = config.max ?? config.target;
      if (currentCount <= max) {
        isValid = true;
        summary = `${currentCount} words written (under maximum limit of ${max}).`;
      } else {
        isValid = false;
        const excess = currentCount - max;
        summary = `${currentCount} / ${max} words. Limit exceeded by ${excess} ${excess === 1 ? 'word' : 'words'}.`;
        for (let i = max; i < words.length; i++) {
          const w = words[i];
          violations.push({
            start: w.start,
            end: w.end,
            message: `Word #${i + 1} ("${w.raw}") exceeds maximum limit of ${max}`,
            severity: 'error',
            word: w.raw,
            line: w.line,
          });
        }
      }
      break;
    }

    case 'range': {
      const min = config.min ?? 1;
      const max = config.max ?? config.target;
      if (currentCount >= min && currentCount <= max) {
        isValid = true;
        summary = `Within range! ${currentCount} words written (target: ${min}–${max}).`;
      } else if (currentCount < min) {
        isValid = false;
        summary = `${currentCount} words written. Minimum required is ${min}.`;
      } else {
        isValid = false;
        const excess = currentCount - max;
        summary = `${currentCount} words written. Exceeds maximum of ${max} by ${excess} words.`;
        for (let i = max; i < words.length; i++) {
          const w = words[i];
          violations.push({
            start: w.start,
            end: w.end,
            message: `Word #${i + 1} exceeds range limit of ${max}`,
            severity: 'error',
            word: w.raw,
            line: w.line,
          });
        }
      }
      break;
    }
  }

  return {
    valid: isValid,
    constraintType: 'wordcount',
    violations,
    summary,
    stats,
  };
}
