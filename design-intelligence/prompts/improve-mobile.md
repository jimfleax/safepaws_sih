# Prompt Template: Improve Mobile Experience

Use when: the specific task is improving (not building from scratch) mobile behavior of an existing
responsive site.

**Route to**: `/responsive-review` first for a structured diagnosis, then targeted fixes per finding.

**Check specifically**: was this ever actually redesigned for mobile, or only reflowed
(`principles/24-mobile-web.md`)? If reflow-only, the fix isn't a patch — it's reconsidering information
priority for the mobile context specifically, which may mean removing/reordering content, not just
resizing it.

**Non-negotiable, fix immediately regardless of scope**: remove `user-scalable=no` if present
(`research/awwwards/04-uncommon-studio.md` §11's real, observed failure); fix any touch target below
44×44px; fix any hover-dependent functionality with no touch equivalent.

**Then**: re-run `/responsive-review` to confirm fixes, and check the primary task can still be
completed end-to-end on a real small viewport.
