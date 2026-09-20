# Typography Tokens

## Structure
```
font-family-display: [theme-specific]
font-family-body: [theme-specific]
font-family-mono: [theme-specific, if needed]

type-scale:
  display-lg / display / headline-lg / headline / title / body-lg / body / body-sm / label / caption
  (each with: size, line-height, weight, tracking)

font-weight: regular / medium / semibold / bold (map to actual numeric weights per family)
```
## Usage guidance
Every text element in a project should map to one named scale tier, not a bespoke size — this is what
makes `principles/05-typography.md`'s hierarchy discipline enforceable in code rather than aspirational
in a style guide nobody follows.

## Theme variation
- Minimal/enterprise themes: fewer scale tiers, tighter range between them, neutral grotesk families.
- Editorial/luxury themes: wider range between display and body tiers, serif or characterful display
  family paired with a quieter body family (`typography/font-pairing.md`).
- Technical/brutalist themes: monospace or grotesk-only, minimal display/body contrast, deliberately
  utilitarian.

See `themes/*.tokens.json` for worked numeric examples per direction.
