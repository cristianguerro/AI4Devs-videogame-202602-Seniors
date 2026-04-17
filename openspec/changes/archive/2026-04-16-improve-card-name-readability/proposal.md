## Why

Card names are currently hard to read during play because the label text is too small, sits on low-contrast surfaces, and does not use the available card space effectively. This should be addressed now because card recognition is a core interaction in every turn, and weak label legibility makes the otherwise polished UI feel harder to use than the game rules require.

## What Changes

- Increase card title legibility by giving the card name a clearer title area, larger effective text treatment, and stronger contrast against the card background.
- Improve the layout and alignment of card labels so longer names remain readable without colliding with card edges or looking cramped.
- Preserve selected-card and active-turn clarity while updating card presentation so readability gains do not weaken current state cues.
- Keep the existing minimal pixel-art direction, but tune typography and card composition for gameplay readability rather than decorative balance.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `cards`: Change the card UI requirements so card names remain readable at gameplay scale, including longer names such as Monkey and Elephant.
- `ui-layout`: Change the layout requirements so the card title area, spacing, and hierarchy support fast card-name recognition without reducing board visibility.

## Impact

- Affected code: [onitama-CFGP/src/scenes/GameScene.js](/home/cris/repos/AI4Devs-videogame-202602-Seniors/onitama-CFGP/src/scenes/GameScene.js)
- Affected systems: in-game card slot rendering, card label styling, and related UI spacing around the centered board layout
- No API or dependency changes are expected
