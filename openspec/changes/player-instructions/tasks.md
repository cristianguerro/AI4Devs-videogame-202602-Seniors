## 1. Tutorial State Persistence

- [ ] 1.1 Define tutorial/help persistence keys and version constant in game state code
- [ ] 1.2 Implement load logic for onboarding state (pending/completed/skipped + version)
- [ ] 1.3 Implement save logic for completed and skipped onboarding outcomes
- [ ] 1.4 Add graceful fallback when local storage is unavailable

## 2. First-Time Instruction Entry

- [ ] 2.1 Add first-time instructional entry prompt UI with Start Tour and Skip actions
- [ ] 2.2 Trigger first-time prompt only when onboarding state is pending for current version
- [ ] 2.3 Dismiss prompt and persist state when user selects Skip
- [ ] 2.4 Dismiss prompt and persist state when user completes quick tour

## 3. On-Demand Help Access

- [ ] 3.1 Add persistent in-game help entry control visible during active turns
- [ ] 3.2 Implement open/close behavior for on-demand help without page reload
- [ ] 3.3 Ensure help entry remains reachable after turn changes and card swaps

## 4. Contextual Guidance Content

- [ ] 4.1 Map guidance copy to interaction states (pick card, pick piece, pick tile)
- [ ] 4.2 Render contextual instruction emphasis that updates with current state
- [ ] 4.3 Ensure instructional overlays do not block critical board/card information

## 5. Validation

- [ ] 5.1 Verify first-time prompt appears only for new state and not after skip/completion on same version
- [ ] 5.2 Verify tutorial version mismatch re-enables onboarding prompt
- [ ] 5.3 Verify on-demand help can be opened during both Player 1 and Player 2 turns
- [ ] 5.4 Verify guidance text transitions correctly across idle, card selected, and piece selected states