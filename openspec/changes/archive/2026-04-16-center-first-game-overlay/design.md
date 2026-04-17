## Context

The onboarding prompt currently appears near the upper-left area and can blend into active game UI. The change introduces a modal-like onboarding emphasis: centered prompt plus dim overlay. The game is rendered on a fixed 320x180 canvas with pixel-art styling and pointer interactions already routed through `GameScene` prompt/help logic.

## Goals / Non-Goals

**Goals:**

- Place the first-game choice prompt at visual center to improve discoverability.
- Use a dim overlay to communicate that a user decision is required before continuing.
- Preserve existing Start/Skip behavior and onboarding persistence state.
- Keep readability and interaction clarity on the small canvas.

**Non-Goals:**

- Redesign the full help system or movement preview panel.
- Change tutorial state storage semantics (pending/completed/skipped/versioning).
- Introduce new dependencies or non-Phaser UI frameworks.

## Decisions

1. Render a dedicated full-screen overlay behind the centered prompt

- Decision: Add a semi-transparent rectangle spanning the viewport, visible only while the first-game prompt is active.
- Rationale: This creates clear visual focus and communicates temporary modal state.
- Alternative considered: only increasing prompt contrast without overlay. Rejected due to weaker focus signal.

2. Anchor prompt container and actions to camera center

- Decision: Recompute prompt/background/button coordinates around camera center rather than fixed corner coordinates.
- Rationale: Guarantees balanced composition across layout tweaks and avoids conflict with board/card UI.
- Alternative considered: move prompt to a different edge region. Rejected because edge placement still competes with active UI zones.

3. Keep interaction blocking consistent with current onboarding gate

- Decision: Continue using existing prompt-visible input guard; overlay is visual and not a separate state machine.
- Rationale: Minimizes regression risk and preserves current onboarding flow behavior.
- Alternative considered: introducing a new modal phase. Rejected as unnecessary complexity for this scope.

## Risks / Trade-offs

- [Risk] Overlay alpha too high may obscure context and feel heavy. -> Mitigation: tune alpha to dim background while keeping board silhouette perceivable.
- [Risk] Centered prompt may overlap the movement preview panel area. -> Mitigation: hide/soft-prioritize non-essential onboarding-adjacent widgets while prompt is visible.
- [Trade-off] Strong modal emphasis improves onboarding clarity but briefly interrupts immediate gameplay scanning. -> Mitigation: keep copy concise with obvious Start/Skip actions.

## Migration Plan

1. Update prompt and overlay geometry/visibility logic in `GameScene`.
2. Validate first-run state still triggers prompt with centered placement.
3. Validate Start/Skip dismisses overlay and prompt together.
4. Smoke-test for both players and ensure no residual input block after dismissal.

## Open Questions

- Should overlay include a subtle vignette/gradient for polish, or remain a flat dim rectangle for style consistency?
- Should the help `?` button be hidden while the first-game prompt is visible to reduce competing affordances?
