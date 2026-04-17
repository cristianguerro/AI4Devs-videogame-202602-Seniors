## Why

Pixel-Tama currently uses placeholder visuals that make pieces and interaction states difficult to read during play. This change improves gameplay clarity and feel by introducing a production-ready minimal-modern pixel asset set and tighter visual feedback.

## What Changes

- Replace placeholder board and piece visuals with readable pixel-art assets.
- Improve interaction readability with clear selection, valid-move, and capture indicators.
- Introduce concise visual-state feedback for turn ownership and card selection.
- Add lightweight motion polish for move, capture, and card-swap events without clutter.
- Establish a small asset pipeline contract (naming, sizing, contrast, and usage rules) for consistent future additions.

## Capabilities

### New Capabilities
- `asset-pipeline`: Defines asset conventions (file naming, dimensions, palette contrast, and import/usage rules) for Pixel-Tama visuals.

### Modified Capabilities
- `pieces`: Upgrade piece rendering requirements for silhouette clarity and owner/type readability.
- `board`: Upgrade tile rendering requirements to support readability and temple landmark distinction.
- `movement`: Strengthen move-marker requirements to clearly differentiate valid and capture destinations.
- `ui-layout`: Add stricter visual state requirements for turn indicator and card selection readability.
- `cards`: Add visual requirements for selected card framing and neutral/player frame distinction.

## Impact

- Affected code: `onitama-CFGP/src/scenes/BootScene.js`, `onitama-CFGP/src/scenes/GameScene.js`, and supporting data/config modules for asset references.
- Affected assets: new pixel-art files under a dedicated assets folder for board, pieces, markers, and UI frames.
- Affected behavior: visual feedback timing and rendering states for selection, movement, capture, and card transitions.
- No backend/API changes; browser-only game remains single-page and client-side.
