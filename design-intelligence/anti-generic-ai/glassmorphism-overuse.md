# Glassmorphism Overuse

## The specific signature
Frosted-glass blur effects applied to panels/cards with no actual layered content behind them to
justify the blur — used purely because it reads as "premium" or "sophisticated" in isolation.

## Why it happens
Glassmorphism is a genuinely striking effect in the right context (a panel floating over rich,
detailed background content) but is frequently copied without the layering that makes it meaningful —
applied over a flat, empty, or solid-color background, the blur has nothing to actually blur, and
becomes a hazy, muddy panel rather than a considered depth effect.

## The test
Is there real, detailed content behind this panel that the blur is meaningfully softening? If the
background is flat/empty, glassmorphism adds visual noise and reduces contrast/legibility for no
benefit.

## The repair
1. Remove the blur where there's nothing behind it to justify the effect; use a plain, appropriately-
   contrasted surface color instead (`tokens/color.md`).
2. Where genuine layering exists (a settings panel over a busy dashboard, a modal over rich background
   content), keep glassmorphism but verify text contrast against the *blurred* background specifically,
   not just the panel's nominal background color — blur can unpredictably shift effective contrast.
3. Never apply glassmorphism to text-critical surfaces (primary reading content, form fields) where
   contrast reliability matters most.

## Accessibility note
Glassmorphism's variable, content-dependent contrast makes it a genuine accessibility risk when
overused — test actual rendered contrast, don't assume the design tool's preview represents every
real background scenario.
