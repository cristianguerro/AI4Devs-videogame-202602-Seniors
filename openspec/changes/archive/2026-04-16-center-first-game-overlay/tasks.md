## 1. Centered Prompt Layout

- [x] 1.1 Refactor first-game prompt container coordinates to anchor on camera center
- [x] 1.2 Reposition Start and Skip controls relative to centered prompt container
- [x] 1.3 Ensure centered prompt fits safely within 320x180 viewport bounds

## 2. Modal Overlay Layer

- [x] 2.1 Add full-viewport dim overlay element in `GameScene` instruction UI setup
- [x] 2.2 Set overlay depth so it appears above gameplay but behind prompt controls
- [x] 2.3 Toggle overlay visibility with the same pending-prompt visibility flow

## 3. Interaction and State Behavior

- [x] 3.1 Keep gameplay input blocked while prompt+overlay are visible
- [x] 3.2 Dismiss centered prompt and overlay together on Start action
- [x] 3.3 Dismiss centered prompt and overlay together on Skip action
- [x] 3.4 Ensure completed/skipped onboarding state prevents prompt+overlay on same version

## 4. Visual and Regression Validation

- [x] 4.1 Verify prompt appears centered on first-run pending state in runtime
- [x] 4.2 Verify overlay visually communicates focused choice without over-darkening board context
- [x] 4.3 Verify help button/panel do not conflict with centered prompt focus mode
- [x] 4.4 Verify no residual input lock remains after prompt dismissal