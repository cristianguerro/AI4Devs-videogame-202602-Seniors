## Why

The first-game prompt currently competes with gameplay elements and is easy to overlook, which weakens onboarding clarity. Centering the message and using a visual overlay now will make the required choice explicit before the player continues.

## What Changes

- Reposition the first-game tutorial prompt to the center of the game viewport.
- Add a dim background overlay while the first-game prompt is visible to indicate focused choice mode.
- Keep clear Start and Skip actions while preserving accessibility and readability on the 320x180 layout.
- Ensure the overlay and centered prompt are shown only when onboarding is pending and dismissed after a choice.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `ui-layout`: Update first-game prompt placement and introduce a modal-style overlay state that emphasizes required player choice.

## Impact

- Affected code: `onitama-CFGP/src/scenes/GameScene.js` tutorial prompt and instruction UI rendering logic.
- Affected behavior: first-run onboarding presentation and perceived interaction priority before gameplay input.
- Dependencies: none external; built with existing Phaser UI primitives.
