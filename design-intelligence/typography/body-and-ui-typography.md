# Body & UI Typography

## Body typography
The type carrying sustained-reading content — governed primarily by `line-length-and-rhythm.md`.
Never below ~16px for primary reading content on any device (a hard accessibility/usability floor, per
`principles/12-accessibility.md`, not adjustable by aesthetic preference).

## UI typography
The type carrying functional interface content — buttons, labels, form fields, navigation, metadata.
Distinct rules from body copy because it's scanned, not read continuously:
- Can be denser and slightly smaller than body copy (down to ~14px for secondary UI labels, never
  smaller for anything a user must read to complete a task).
- Weight should carry more of the hierarchy load than size in dense UI — a slightly bolder label at the
  same size as surrounding text can separate it without disrupting a tight grid the way a size jump
  would.
- Consistency matters more than expressiveness — UI type is infrastructure; unexpected typographic
  personality here (unless it's the whole brand's point, per `typography/editorial-typography.md`-style
  contexts) reads as inconsistency, not craft.

## The relationship between the two
A product's type system should make it visually obvious which text is "content to read" (body) versus
"interface to operate" (UI) — often via a deliberate weight, size, or even typeface distinction. Blurring
this line (making UI labels the same visual weight as body prose) can make an interface harder to scan.

## Failure mode
Applying editorial/display typographic flourish (unusual tracking, decorative weight shifts) to
functional UI labels — appropriate craft in the wrong register, undermining scanability.
