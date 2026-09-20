# Line Length & Vertical Rhythm

## Line length
Body/reading text: 45-75 characters per line (roughly 60-75 for optimal comfort in most Latin-script
contexts). Below ~45 forces excessive eye movement (too many line breaks); above ~75 makes it hard to
track from the end of one line to the start of the next. This is a hard, well-established readability
constraint, not a style preference — verify actual rendered line length at each breakpoint, since a
container that looks fine on a designer's monitor can easily exceed this range on a wider viewport with
no max-width set.

## Vertical rhythm
Line-height and paragraph spacing should follow a consistent baseline logic so text blocks feel governed
rather than arbitrarily spaced. Practical guidance:
- Body text line-height: 1.4-1.6 (looser for smaller text, tighter is acceptable for larger text).
- Display/headline line-height: 1.0-1.2 (large type needs less relative line-height to avoid looking
  disconnected).
- Paragraph spacing should exceed line-height within a paragraph (more space *between* paragraphs than
  *within* one) so paragraph boundaries are legible without a first-line indent.

## Failure mode
A single line-height value applied to both display and body type — produces either cramped-looking
headlines or bloated, disconnected-looking body text, since the correct value moves inversely with size
(`principles/05-typography.md`).

## Implementation note
Measure actual rendered line length with real content at real container widths per breakpoint — don't
rely on a fixed character-count assumption without checking the actual font's average character width.
