# Z-Index Tokens

## Structure
A small, named scale — never arbitrary per-component z-index values, which is one of the most common,
hardest-to-debug sources of stacking-context bugs in real projects.
```
z-base: 0
z-dropdown: 10
z-sticky: 20
z-overlay-scrim: 30
z-modal: 40
z-toast: 50
z-tooltip: 60
```
## Usage guidance
- Every component that needs to stack above normal content should reference one of these named tiers,
  not an ad hoc value like `z-index: 999`.
- Toasts/notifications sit above modals in most systems (a toast confirming an action should remain
  visible even if a modal is open) — verify this ordering matches actual product needs rather than
  assuming.
- Tooltips sit at the top of the scale since they must never be obscured by any other layered UI while
  visible.

## Failure mode
Escalating arbitrary z-index values across a growing codebase (999, 9999, 99999) as developers fight
stacking conflicts without a shared scale — a direct, checkable maintainability failure
(`principles/25-design-systems.md`).
