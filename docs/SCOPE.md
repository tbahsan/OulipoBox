# OulipoBox — Scope & Architecture Contract

## 1. Target Audience & Problem Statement
Writers, poets, educators, and creative coders practicing formal constrained writing (Oulipo tradition). Existing tools either:
- Block typing abruptly, destroying writing flow.
- Lack deterministic letter/syllable diagnostics.
- Rely on cloud servers, privacy-invading trackers, or subscription paywalls.

OulipoBox is a 100% client-side, zero-tracking, offline-first playground with non-blocking real-time highlights.

## 2. Invariants & Guarantees
1. **Zero Text Mutation:** User text is NEVER silently deleted, truncated, or blocked.
2. **Pure Diagnostics:** Constraints return character spans `[start, end]`, line numbers, and descriptive messages.
3. **Deterministic Math:** Case-insensitive ASCII matching, NFD-based diacritic stripping, exact word tokenization.
4. **Y Policy:** The letter 'Y' is treated as a consonant by default across all constraints (per roadmap §E10 specification). Users may explicitly toggle "Treat Y as vowel" in Univocalic mode.
5. **No Telemetry:** Zero external HTTP requests, zero analytics, zero cookies.

## 3. Supported Constraints (v0.1)
- **Lipogram:** Forbid one or more letters (e.g. 'E').
- **Univocalic:** Exactly one vowel allowed throughout document.
- **Acrostic:** Non-empty lines must start with successive letters of target word.
- **Word Count Targets:** Exact limit, minimum, maximum, or bounded range.
- **Tautogram / Alliteration:** Every word starts with chosen initial letter.
- **Monosyllabic:** Every word must have exactly 1 syllable.

## 4. Out of Scope (v0.1)
- Automatic syllable-perfect Haiku generation (planned for v0.2 with manual override).
- Creative quality scoring / AI rewriting.
