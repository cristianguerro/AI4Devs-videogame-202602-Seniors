## Context

Pixel-Tama currently uses a piece-first interaction inside GameScene: the player clicks a friendly piece, sees the union of reachable destinations from both active cards, then clicks a card to narrow that set, then clicks a destination. The rules engine already knows which moves belong to which card, but the current board presentation does not preserve that meaning visually at the moment the player first engages with the turn. The change is cross-cutting because it touches card input handling, move-selection state, highlight rendering, and gameplay layout.

## Goals / Non-Goals

**Goals:**

- Reorder turn interaction to a card-first flow that teaches the chosen movement pattern before the player picks a piece.
- Keep the existing move legality, mirrored Player 2 orientation, capture handling, and card swap rules intact.
- Add a clear movement preview treatment and selection model that works on both pointer and touch-first input.
- Keep the layout readable within the current low-resolution gameplay frame.

**Non-Goals:**

- Redesign the full board layout or replace the existing card art system.
- Change the core Onitama rules, AI strategy, or turn resolution logic.
- Introduce new dependencies, animation-heavy tutorials, or a separate onboarding mode.

## Decisions

### Use card-first selection as the primary move flow

The turn should begin with card preview and card selection rather than piece selection. This removes the ambiguous intermediate state where the board shows a mixed result set from both cards. It also makes the card UI instructional rather than purely referential.

Alternatives considered:

- Keep piece-first flow and color-code board markers by card: lower implementation risk, but still delays understanding of the card pattern until after piece selection.
- Show full movement diagrams inside every compact card slot: better fidelity to the physical game, but too cramped for the current 320x180 layout.

### Separate preview state from locked selection state

Preview and active selection should be distinct. Hover on desktop and first tap on touch can preview a card temporarily, while click or second tap locks the card for the turn. This avoids accidental commitment on touch while still making the card meaning visible early.

Alternatives considered:

- Treat every hover or tap as a committed selection: simpler, but too easy to misfire on touch devices.
- Omit preview and require explicit click only: simpler state model, but weaker discoverability.

### Emphasize eligible pieces before destinations

Once a card is active, the board should first indicate only pieces that can legally use that card. Destination markers should appear only after one eligible piece is chosen. This keeps a single question on screen at a time and prevents the board from becoming visually noisy.

Alternatives considered:

- Show both eligible pieces and all destinations immediately: more information at once, but higher cognitive load and more overlap in a compact board.

### Add a dedicated movement preview treatment near the gameplay UI

The chosen card's movement pattern should appear in a dedicated preview area rather than inside the existing shallow card body. The preview must mirror orientation for the active player using the same directional logic as move validation so the diagram always matches the board.

Alternatives considered:

- Overlay the preview directly on the board center: more direct, but risks obscuring pieces and temple squares.
- Expand every card slot to fit a movement grid: would force broader layout changes than this change requires.

### Preserve existing move execution and card swap pipeline

The card-first flow should reuse the existing move legality and resolution path after a card and piece are selected. This limits regression risk by changing turn setup and board presentation without rewriting capture, win-condition, or swap behavior.

Alternatives considered:

- Rebuild the entire turn state machine around a new action model: more extensible, but unnecessary for the scope of this UX change.

## Risks / Trade-offs

- [More interaction states] -> Keep the model explicit: idle, previewing card, active card selected, piece selected, resolving move.
- [Touch and hover parity can diverge] -> Define preview and lock semantics that work without hover, and verify cancellation paths on touch.
- [Preview panel may crowd the current layout] -> Reuse the neutral-card side of the interface and keep the preview minimal and orientation-driven.
- [Players accustomed to piece-first flow may need a brief adjustment] -> Make eligible-piece emphasis and active-card state visually strong so the new order is self-explanatory.
