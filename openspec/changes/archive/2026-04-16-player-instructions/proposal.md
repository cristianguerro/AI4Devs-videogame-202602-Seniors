## Why

New players can complete moves, but the interaction model (pick card, pick piece, pick tile) is not self-explanatory on first contact. Adding lightweight guidance now will reduce early confusion and make the game easier to learn without forcing experienced players through repeated tutorial friction.

## What Changes

- Add a first-time onboarding flow that offers a short guided explanation of the move sequence.
- Add an always-available on-demand help entry point during gameplay.
- Present context-aware instruction copy that reflects the current interaction step.
- Persist onboarding/help preferences locally so guidance can be skipped or revisited.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `ui-layout`: Add first-time instructional overlay/tour surfaces and in-game help entry point with clear visual hierarchy.
- `game-state`: Track and persist onboarding/help-view state (first-run prompt, skipped/completed tutorial, tutorial content version).

## Impact

- Affected code: `onitama-CFGP/src/scenes/GameScene.js` and related UI rendering/input paths.
- Affected behavior: first-run experience, tutorial visibility rules, and help accessibility during turns.
- Dependencies: browser local persistence mechanism (no external packages expected).