/**
 * OulipoBox Core Types
 */

export type ConstraintType =
  | 'lipogram'
  | 'univocalic'
  | 'acrostic'
  | 'wordcount'
  | 'alliteration'
  | 'monosyllabic';

export interface Violation {
  start: number; // 0-based character index in full text
  end: number;   // exclusive end character index
  message: string;
  severity: 'error' | 'warning';
  word?: string;
  char?: string;
  line?: number; // 1-based line index
}

export interface TextStats {
  charCount: number;
  charCountNoSpaces: number;
  wordCount: number;
  lineCount: number;
  nonEmptyLineCount: number;
  vowelCounts: { a: number; e: number; i: number; o: number; u: number; y: number };
  topLetters: Array<{ letter: string; count: number; percentage: number }>;
}

export interface LipogramConfig {
  forbiddenLetters: string[]; // e.g. ['e'] or ['t', 's']
  caseSensitive?: boolean;
}

export interface UnivocalicConfig {
  allowedVowel: 'a' | 'e' | 'i' | 'o' | 'u';
  treatYAsVowel?: boolean; // default: false (Y is consonant per roadmap spec)
}

export interface AcrosticConfig {
  targetWord: string; // e.g. "AUTUMN"
  ignorePunctuation?: boolean;
}

export interface WordCountConfig {
  mode: 'exact' | 'min' | 'max' | 'range';
  target: number; // e.g. 50 or 100
  min?: number;
  max?: number;
}

export interface AlliterationConfig {
  targetLetter: string; // e.g. "p"
}

export interface MonosyllabicConfig {
  allowExceptions?: string[];
}

export type ConstraintConfig =
  | { type: 'lipogram'; config: LipogramConfig }
  | { type: 'univocalic'; config: UnivocalicConfig }
  | { type: 'acrostic'; config: AcrosticConfig }
  | { type: 'wordcount'; config: WordCountConfig }
  | { type: 'alliteration'; config: AlliterationConfig }
  | { type: 'monosyllabic'; config: MonosyllabicConfig };

export interface ValidationResult {
  valid: boolean;
  constraintType: ConstraintType;
  violations: Violation[];
  summary: string;
  stats: TextStats;
}

export interface Preset {
  id: string;
  name: string;
  nameBn: string;
  category: 'classic' | 'poetic' | 'structural';
  description: string;
  descriptionBn: string;
  inspiration?: string;
  config: ConstraintConfig;
  sampleText: string;
}
