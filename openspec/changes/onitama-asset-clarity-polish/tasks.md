## 1. Asset Pipeline Setup

- [ ] 1.1 Create asset directory structure for `board/`, `pieces/`, `markers/`, and `ui/` under `onitama-CFGP`
- [ ] 1.2 Define and document texture key naming contract in code constants (category-prefixed keys)
- [ ] 1.3 Update `BootScene` preload logic to load all new asset categories from file paths
- [ ] 1.4 Add fallback handling/logging for missing texture keys during scene creation

## 2. Board Visual Upgrade

- [ ] 2.1 Add new base tile and temple tile assets matching target pixel dimensions
- [ ] 2.2 Replace board tile rendering to use new tile textures instead of tinted placeholder pixel blocks
- [ ] 2.3 Apply temple tile mapping at (2,0) and (2,4) using dedicated temple texture
- [ ] 2.4 Verify board textures remain subordinate to piece/marker readability at runtime scale

## 3. Piece Visual Upgrade

- [ ] 3.1 Add four piece sprite assets (P1 student/master, P2 student/master) with silhouette-first design
- [ ] 3.2 Replace `createPieceSprite` rendering path to use loaded piece textures
- [ ] 3.3 Ensure master/student and player ownership remain distinguishable on both tile types
- [ ] 3.4 Confirm piece placement, movement, and capture flows preserve sprite lifecycle correctness

## 4. Move Marker Clarity

- [ ] 4.1 Add marker assets for selected piece, valid move, and capture move states
- [ ] 4.2 Update highlight rendering logic to choose valid-vs-capture marker variants per destination
- [ ] 4.3 Add persistent selected-piece visual anchor while destination markers are active
- [ ] 4.4 Ensure all markers clear correctly on move execution, deselection, and turn transition

## 5. Card and Turn State UI Clarity

- [ ] 5.1 Add UI assets for player card frame, neutral card frame, and selected card state
- [ ] 5.2 Update card slot rendering to apply frame variants by slot type and selection state
- [ ] 5.3 Add active-turn and idle-turn indicator visual assets/states
- [ ] 5.4 Update turn indicator rendering so active player is immediately readable without text dependence

## 6. Minimal Motion Polish

- [ ] 6.1 Implement subtle selected-piece pulse timing within the agreed animation envelope
- [ ] 6.2 Add brief move execution micro-effect that does not obscure pieces or markers
- [ ] 6.3 Add short capture confirmation flash effect tuned for tactical clarity
- [ ] 6.4 Polish card swap transition timing (short slide/ease, no flashy bounce)

## 7. Readability and QA Validation

- [ ] 7.1 Run readability checks: identify owner/type/selected state in under one second
- [ ] 7.2 Validate marker distinguishability on all board cells (normal and temple)
- [ ] 7.3 Validate active turn and selected card states at a glance during full match flow
- [ ] 7.4 Confirm no new console/runtime errors across complete game sessions

## 8. Regression and Documentation

- [ ] 8.1 Verify core gameplay logic (movement, capture, win conditions, AI turns) remains unchanged
- [ ] 8.2 Update project notes with asset naming/dimension/contrast conventions for future contributors
- [ ] 8.3 Capture before/after screenshots for internal QA comparison (readability-focused)
- [ ] 8.4 Re-run OpenSpec apply status to confirm the change is implementation-ready
