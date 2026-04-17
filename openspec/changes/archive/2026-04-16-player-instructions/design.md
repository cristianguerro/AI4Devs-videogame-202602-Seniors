## Context

Pixel-Tama currently uses a card-first interaction flow with compact contextual hints in the move preview panel. This is functional once learned, but first-time players are not explicitly oriented to the sequence (pick card, pick piece, pick tile), and there is no dedicated in-game help entry point for re-learning. The game runs on a 320x180 canvas with both mouse and touch interactions, and should remain readable and low-friction.

## Goals / Non-Goals

**Goals:**
- Provide a first-time instructional experience that explains the move sequence without forcing long tutorial friction.
- Provide on-demand help accessible during gameplay at any time.
- Keep guidance aligned with current interaction state and existing visual language.
- Persist tutorial/help state locally so users are not repeatedly interrupted.

**Non-Goals:**
- Rework move rules, card logic, AI behavior, or win conditions.
- Add backend/user-account persistence.
- Add a long multi-screen tutorial campaign.

## Decisions

1. Use a lightweight first-run coach entry point
- Decision: On first eligible gameplay load, show a compact prompt offering a quick tour or skip.
- Rationale: Gives immediate orientation while respecting experienced players.
- Alternative considered: Mandatory full tutorial before play. Rejected due to high friction and replay annoyance.

2. Keep a persistent on-demand help affordance
- Decision: Add a visible in-game help trigger (for example, button/icon) that opens concise instruction content any time during turns.
- Rationale: Players need recovery support after breaks, not only on first launch.
- Alternative considered: First-run-only instruction. Rejected because relearning needs are common.

3. Drive instruction copy from current interaction state
- Decision: Tutorial/help text maps directly to existing selection states (idle, previewing card, card selected, piece selected) so guidance always matches what the player can do next.
- Rationale: Reuses proven state model and avoids speculative branching.
- Alternative considered: Static, non-contextual text block. Rejected due to weaker guidance quality.

4. Persist onboarding/help preferences in versioned local storage
- Decision: Store first-run and completion/skip state in local browser storage with a tutorial content version marker.
- Rationale: Avoids repeated interruptions and allows future re-prompting when guidance meaningfully changes.
- Alternative considered: No persistence. Rejected because first-run prompt would reappear every session.

## Risks / Trade-offs

- [Risk] Overlays can clutter a small 320x180 layout and obscure board readability. -> Mitigation: use concise copy, limited steps, and predictable placement that does not block critical board/card information.
- [Risk] Input conflicts if tutorial overlays and gameplay clicks overlap. -> Mitigation: explicitly define whether overlay pauses board input or only annotates, and enforce consistent pointer handling.
- [Risk] localStorage may be unavailable in constrained environments. -> Mitigation: fall back to session-only behavior and fail gracefully without blocking gameplay.
- [Trade-off] More guidance improves onboarding but adds UI complexity to core screen. -> Mitigation: default to minimal visuals and keep on-demand help collapsible.