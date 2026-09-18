# OulipoBox — Constraint Rules & Phonological Policies

## 1. Lipogram
- **Definition:** Writing that deliberately omits one or more specific letters of the alphabet.
- **Normalization:** Evaluated case-insensitively. Diacritics are decomposed via Unicode NFD (e.g. `é`, `ê`, `è` count as `e`).
- **Punctuation & Whitespace:** Fully permitted; does not affect constraint compliance.

## 2. Univocalic
- **Definition:** Writing using only one vowel throughout the entire text.
- **Permitted Vowels:** `A`, `E`, `I`, `O`, or `U`.
- **The 'Y' Policy:** Per standard Oulipian practice and Roadmap §E10, 'Y' is classified as a consonant by default. Words like *dry, sly, spy, rhythm* are compliant in non-Y univocalics unless the user toggles "Treat Y as vowel".

## 3. Acrostic
- **Definition:** A poem or verse where the first letter of each successive line spells out a word or phrase.
- **Empty Lines:** Blank lines (used for stanza separation) are ignored during sequence matching.
- **Punctuation:** If a line starts with quotes or indentation (e.g. `"The...`), the first alphabetic character (`T`) is evaluated.

## 4. Word Count Targets
- **Definitions:**
  - *Drabble:* Exactly 100 words.
  - *Mini-Saga:* Exactly 50 words.
  - *Six-Word Story:* Exactly 6 words.
- **Hyphenation & Contractions:** Standard contractions (`don't`, `it's`) and hyphenated compounds count as single words.

## 5. Tautogram (Alliteration)
- **Definition:** A text where every word begins with the same letter.
- **Evaluation:** Evaluated on the first alphabetic letter of every word token.

## 6. Monosyllabic
- **Definition:** Every word in the text consists of exactly one syllable.
- **Counter:** Uses a curated dictionary for common irregulars + phonetic rules (silent 'e', consonant clusters, past-tense '-ed' hiatus). Polysyllabic words are flagged.
