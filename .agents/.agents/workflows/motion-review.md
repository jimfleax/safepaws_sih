# Workflow: /motion-review

Focused review of every significant animation/transition, using `agents/motion-director.md`.

## Steps
1. Inventory every significant motion pattern on the surface being reviewed.
2. For each, attempt to complete: TRIGGER → MOTION → PURPOSE → USER VALUE
   (`design-intelligence/motion/principles.md`). If PURPOSE is honestly "looks nice," flag for removal
   or redesign.
3. Check duration/easing against `design-intelligence/tokens/motion.md`'s token values — flag untuned
   defaults.
4. Verify entrance uses ease-out, exit uses ease-in, and physically-manipulated elements use appropriate
   spring/physics easing sparingly (`design-intelligence/motion/easing.md`).
5. Verify `prefers-reduced-motion` produces a genuinely reduced/alternative experience
   (`design-intelligence/motion/reduced-motion.md`).
6. Verify animated properties are compositor-friendly (transform/opacity) rather than layout-triggering.
7. Check motion "voice" consistency across the surface (`design-intelligence/motion/choreography.md`) —
   flag inconsistent duration/easing character between similar interaction types.
8. Check motion volume against the surface type's appropriate budget (`design-intelligence/
   principles/18-dashboard-design.md` for high-frequency tools vs. `principles/22-creative-web.md` for
   showcase contexts).

## Output
Per-pattern verdict (keep/cut/adjust) with the specific token or purpose fix needed.
