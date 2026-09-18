# OulipoBox — Accessibility (a11y) Conformance

## Conformance Standards (WCAG 2.1 AA)
1. **Semantic Structure:** Native `<header>`, `<main>`, `<section>`, `<footer>`, `<button>`, and `<textarea>`.
2. **Keyboard Navigation:** Full focus visibility with distinct outline offsets.
3. **Screen Reader Live Regions:** Compliance status updates via `aria-live="polite"` and `role="status"`.
4. **Color Contrast:**
   - Dark theme background `#0f172a` vs text `#f8fafc`: Contrast ratio > 14:1.
   - Light theme background `#f8fafc` vs text `#0f172a`: Contrast ratio > 15:1.
   - Violation highlights use both background tint AND distinct bottom border markers to avoid relying solely on color.
