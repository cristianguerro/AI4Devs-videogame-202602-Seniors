## Why

Onitama is a compact, elegant strategy game that is ideal for a browser-based implementation. Building this as "Pixel-Tama" demonstrates proficiency in Phaser 3 game loops, grid-based movement, turn-based state management, and pixel-art UI — all in a self-contained, shareable web game.

## What Changes

- Introduce a fully playable browser-based Onitama game using Phaser 3.
- Implement a 5×5 grid board with two players (1 Master + 4 Students each).
- Implement card-based movement system with 5 randomly selected cards per match (2 per player, 1 neutral).
- Implement card rotation: used card swaps with the neutral card each turn.
- Implement both win conditions: capture the opponent's Master (Way of the Stone) or move own Master to opponent's Temple Arch (Way of the Stream).
- Implement local multiplayer (pass-and-play) and a random-move AI opponent.
- Implement point-and-click input with visual highlighting of valid moves.
- Implement a low-res pixel art aesthetic (320×180 scaled up).
- Implement a complete game state machine: `PLAYER_1_TURN`, `PLAYER_2_TURN`, `TRANSITIONING_CARD`, `GAME_OVER`.

## Capabilities

### New Capabilities

- `board`: 5×5 grid rendering and coordinate system; piece placement and movement on the grid.
- `pieces`: Master and Student piece entities with ownership, rendering, and capture logic.
- `cards`: Card data model (movement offsets), random selection from pool, display in card slots, and neutral card rotation.
- `movement`: Valid move calculation per selected piece and card; move execution and capture resolution.
- `game-state`: Turn-based state machine managing whose turn it is, card transitions, and game-over detection.
- `win-conditions`: Detection of Way of the Stone (Master captured) and Way of the Stream (Master on Temple Arch).
- `ai-opponent`: Random-move AI that selects a valid card and piece move each turn.
- `ui-layout`: HUD layout — board center, player card slots top/bottom, neutral card slot on right; pixel art visual style.

### Modified Capabilities

*(none — this is a greenfield project)*

## Impact

- New project directory: `onitama-CFGP/`
- Dependencies: Phaser 3 (CDN or bundled)
- No backend, no persistence, no external APIs
- Runs entirely in the browser; single HTML entry point
