## 1. Centered Prompt Layout

- [ ] 1.1 Refactor first-game prompt container coordinates to anchor on camera center
- [ ] 1.2 Reposition Start and Skip controls relative to centered prompt container
- [ ] 1.3 Ensure centered prompt fits safely within 320x180 viewport bounds

## 2. Modal Overlay Layer

- [ ] 2.1 Add full-viewport dim overlay element in `GameScene` instruction UI setup
- [ ] 2.2 Set overlay depth so it appears above gameplay but behind prompt controls
- [ ] 2.3 Toggle overlay visibility with the same pending-prompt visibility flow

## 3. Interaction and State Behavior

- [ ] 3.1 Keep gameplay input blocked while prompt+overlay are visible
- [ ] 3.2 Dismiss centered prompt and overlay together on Start action
- [ ] 3.3 Dismiss centered prompt and overlay together on Skip action
- [ ] 3.4 Ensure completed/skipped onboarding state prevents prompt+overlay on same version

## 4. Visual and Regression Validation

- [ ] 4.1 Verify prompt appears centered on first-run pending state in runtime
- [ ] 4.2 Verify overlay visually communicates focused choice without over-darkening board context
- [ ] 4.3 Verify help button/panel do not conflict with centered prompt focus mode
- [ ] 4.4 Verify no residual input lock remains after prompt dismissal