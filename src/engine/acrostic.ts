import { AcrosticConfig, ValidationResult, Violation } from './types';
import { calculateStats, extractLines, isAsciiLetter, stripDiacritics } from './text-utils';

export function validateAcrostic(text: string, config: AcrosticConfig): ValidationResult {
  const stats = calculateStats(text);
  const violations: Violation[] = [];

  const rawTarget = stripDiacritics(config.targetWord.toUpperCase());
  const targetLetters = rawTarget.split('').filter((c) => isAsciiLetter(c));

  const allLines = extractLines(text);
  const nonEmptyLines = allLines.filter((l) => l.trimmed.length > 0);

  for (let i = 0; i < nonEmptyLines.length; i++) {
    const line = nonEmptyLines[i];
    if (i < targetLetters.length) {
      const expectedChar = targetLetters[i];
      if (!line.firstChar) {
        violations.push({
          start: line.start,
          end: line.end,
          message: `Line ${line.lineNumber} does not begin with an alphabetic letter (expected '${expectedChar}').`,
          severity: 'error',
          line: line.lineNumber,
        });
      } else if (line.firstChar.char !== expectedChar) {
        violations.push({
          start: line.firstChar.index,
          end: line.firstChar.index + 1,
          message: `Line ${line.lineNumber} begins with '${line.firstChar.char}', but expected '${expectedChar}' for letter ${i + 1} of "${targetLetters.join('')}".`,
          severity: 'error',
          char: line.firstChar.char,
          line: line.lineNumber,
        });
      }
    } else {
      // Extra line beyond the target word length
      violations.push({
        start: line.start,
        end: line.end,
        message: `Line ${line.lineNumber} exceeds the target acrostic length (${targetLetters.length} lines required).`,
        severity: 'warning',
        line: line.lineNumber,
      });
    }
  }

  const missingLines = targetLetters.length - nonEmptyLines.length;
  let summary = '';

  if (targetLetters.length === 0) {
    summary = 'Please enter a target acrostic word or phrase.';
  } else if (violations.length === 0 && missingLines === 0) {
    summary = `Acrostic perfect! All ${targetLetters.length} lines spell out "${targetLetters.join('')}".`;
  } else if (missingLines > 0) {
    const remainingLetters = targetLetters.slice(nonEmptyLines.length).join('');
    summary = `${nonEmptyLines.length} of ${targetLetters.length} lines written. Still need ${missingLines} more ${missingLines === 1 ? 'line' : 'lines'} for: "${remainingLetters}".`;
  } else {
    summary = `Found ${violations.length} acrostic ${violations.length === 1 ? 'mismatch' : 'mismatches'} for "${targetLetters.join('')}".`;
  }

  const isValid = violations.length === 0 && missingLines === 0 && targetLetters.length > 0;

  return {
    valid: isValid,
    constraintType: 'acrostic',
    violations,
    summary,
    stats,
  };
}
