# Bad Gradient Patterns

## The specific signature
A purple-to-blue (or similarly generic) mesh/blob gradient, applied as a hero background or section
divider, with no connection to brand color, content, or a stated purpose — recognizable as "AI SaaS
aesthetic" precisely because it's the statistical average of thousands of similar, unrelated gradients.

## Why it happens
Gradients are cheap to generate, always look "modern," and require no actual brand or content decision
— which is exactly why they're a generic-AI tell: they can be applied identically to any product with
no adjustment.

## What good gradient use actually looks like (from this research)
Stripe's gradient wave (`research/awwwards/01-stripe.md` §5): large, soft, low-saturation, confined to
background/atmosphere, paired with a documented static fallback, and tied to a specific stated brand
tone ("serious infrastructure, approachable execution"). The gradient is rare (used in one specific
location, not tiled across every section) and never applied to interactive elements or text.

## The repair
1. Ask what specific brand color(s) this gradient should actually use — if the answer is "whatever
   looks nice," that's the signal to remove the gradient rather than pick a color.
2. Confine any gradient to background/atmosphere use — never on buttons, borders, or text where it
   competes with legibility and state-signaling (`principles/06-color.md`).
3. Use it in exactly one or two locations on a page, not as a repeated section-divider device.
4. If removing the gradient makes the page feel empty, that's evidence the page was relying on
   decoration rather than content/hierarchy to carry interest — fix the underlying composition instead
   of re-adding the gradient.

## When gradients are legitimate
Data visualization (a genuine continuous-value legend), true brand-color expressions with a stated
reason, and dark-mode atmosphere effects used sparingly — see `principles/06-color.md`.
