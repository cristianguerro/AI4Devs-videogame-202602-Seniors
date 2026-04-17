## 1. Card Title Layout Update

- [ ] 1.1 Refactor card slot rendering in `GameScene` to reserve a dedicated title region for each player and neutral card
- [ ] 1.2 Replace the current single centered label treatment with a readability-first title layout for idle and selected card states
- [ ] 1.3 Tune card title positioning and spacing so the updated labels fit within the existing board-centered HUD footprint

## 2. Long-Name Fitting Rules

- [ ] 2.1 Implement deterministic label fitting rules for short and long card names without freeform text shrinking
- [ ] 2.2 Validate that longer names such as Monkey and Elephant remain fully readable in player and neutral slots
- [ ] 2.3 Ensure the fitted title treatment stays visually consistent across Player 1, Player 2, and neutral cards

## 3. Contrast and State Clarity

- [ ] 3.1 Update card surface styling so title text has stronger contrast and hierarchy against the card background
- [ ] 3.2 Preserve selected-card highlighting while keeping the card name readable in selected and idle states
- [ ] 3.3 Verify active-turn readability remains clear after the card title and contrast changes

## 4. Validation and Regression

- [ ] 4.1 Run manual readability checks on the full shipped card set at normal gameplay scale
- [ ] 4.2 Confirm the updated card UI does not overlap the centered board or break the current layout on scene load
- [ ] 4.3 Verify no gameplay logic regressions in card selection, move highlighting, card swapping, and turn transitions
- [ ] 4.4 Re-run OpenSpec status to confirm the change is ready for implementation