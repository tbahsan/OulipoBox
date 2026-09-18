import { ConstraintConfig, ValidationResult } from './types';
import { validateLipogram } from './lipogram';
import { validateUnivocalic } from './univocalic';
import { validateAcrostic } from './acrostic';
import { validateWordCount } from './wordcount';
import { validateAlliteration } from './alliteration';
import { validateMonosyllabic } from './monosyllabic';

export * from './types';
export * from './text-utils';
export { validateLipogram } from './lipogram';
export { validateUnivocalic } from './univocalic';
export { validateAcrostic } from './acrostic';
export { validateWordCount } from './wordcount';
export { validateAlliteration } from './alliteration';
export { validateMonosyllabic, countSyllables } from './monosyllabic';

/**
 * Universal validator: validates input text against any given constraint configuration.
 */
export function validateText(text: string, constraint: ConstraintConfig): ValidationResult {
  switch (constraint.type) {
    case 'lipogram':
      return validateLipogram(text, constraint.config);
    case 'univocalic':
      return validateUnivocalic(text, constraint.config);
    case 'acrostic':
      return validateAcrostic(text, constraint.config);
    case 'wordcount':
      return validateWordCount(text, constraint.config);
    case 'alliteration':
      return validateAlliteration(text, constraint.config);
    case 'monosyllabic':
      return validateMonosyllabic(text, constraint.config);
  }
}
