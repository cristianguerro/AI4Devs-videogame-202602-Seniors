## Context

This is a greenfield browser-based implementation of the board game Onitama, built with Phaser 3. The project lives in `onitama-CFGP/` and runs as a single HTML page with no backend. All game logic, rendering, and UI are client-side only.

## Goals / Non-Goals

**Goals:**
- Deliver a fully playable Onitama match (local 2-player pass-and-play, or vs. random-move AI).
- Implement all core game mechanics: 5×5 board, pieces, card-based movement, card rotation, both win conditions.
- Pixel art visual style at 320×180 scaled up via Phaser's scale manager.
- Clean state machine to manage turns, card transitions, and game-over.
- Point-and-click input: select piece → select card → select destination.
- Highlight valid move tiles when piece + card are selected.

**Non-Goals:**
- Online multiplayer, advanced AI (Minimax/MCTS), save states, card drafting UI.
- Complex animations, audio, or accessibility features.
- Mobile-specific optimizations beyond basic touch support.

## Decisions

### Phaser 3 via CDN
Use Phaser 3 loaded from CDN in a single `index.html`. Avoids build tooling overhead for this scope.
- Alternative considered: Vite + npm — overkill for a single-page game exercise.

### Scene Architecture
Three Phaser Scenes: `BootScene` (asset preload), `GameScene` (main game), `GameOverScene` (result display).
- Alternative: Single scene with show/hide — harder to manage state resets.

### State Machine as a plain object
A JS object `gameState` with an enum-like `phase` string (`PLAYER_1_TURN`, `PLAYER_2_TURN`, `TRANSITIONING_CARD`, `GAME_OVER`) and simple transition functions. No external state library needed at this scale.
- Alternative: XState — adds dependency and complexity for a simple 4-state machine.

### Card Data as a static JS module
All 16 official Onitama cards encoded as a JS array of objects with `{ name, moves: [{dx, dy}], stamp }`. Five cards are randomly selected at game start.
- Alternative: JSON file fetched async — adds loading complexity unnecessarily.

### Grid as a logical array + Phaser GameObjects
Board state is a 5×5 JS array of `{ piece, owner }`. Phaser renders tiles and pieces as `Image` or `Graphics` objects. Logical state and visual state are kept in sync on every move.

### Input: Three-click flow
1. Click piece → highlight valid moves (for each card the player holds).
2. Click card → filter highlights to that card's moves only.
3. Click highlighted tile → execute move.
Cancel selection on clicking an invalid tile or the same piece.

### AI: Random valid move
On the AI's turn, enumerate all valid (piece, card, destination) triples and pick one at random. Introduce a short artificial delay (500ms) before executing for UX.

## Risks / Trade-offs

- **Card offset mirroring for Player 2** → Player 2's cards show moves relative to their orientation (dx/dy negated). Mitigation: apply a `flipForPlayer2` transform in the move calculator.
- **Pixel art scaling blurriness** → Set Phaser `pixelArt: true` in game config to disable antialiasing.
- **Touch input vs click** → Phaser's `setInteractive` handles both; no extra work needed.
- **Card swap timing confusion** → Animate the card swap visually before advancing the turn phase to keep the player informed.
