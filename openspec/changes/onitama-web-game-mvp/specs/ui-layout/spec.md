## ADDED Requirements

### Requirement: Game renders at low resolution scaled up
The system SHALL render the game at a base resolution of 320×180 pixels, scaled up to fill the browser viewport while maintaining pixel integrity (no antialiasing).

#### Scenario: Pixel art mode enabled
- **WHEN** the Phaser game config is applied
- **THEN** `pixelArt: true` is set and the canvas renders without smoothing

### Requirement: UI layout places board center, cards top/bottom, neutral card right
The system SHALL position the 5×5 board in the center of the canvas, Player 1's cards at the bottom, Player 2's cards at the top, and the Neutral card on the right side.

#### Scenario: All UI elements visible on game start
- **WHEN** the GameScene renders
- **THEN** the board, both players' card slots, and the neutral card slot are all visible without overlap

### Requirement: Valid move tiles are highlighted
The system SHALL highlight cells that are valid destinations when the player has selected a piece and a card.

#### Scenario: Highlights appear on piece + card selection
- **WHEN** a player selects a piece and a card
- **THEN** all valid destination tiles are visually highlighted (e.g., tinted or overlaid)

#### Scenario: Highlights clear on move execution or deselection
- **WHEN** a player executes a move or clicks to deselect
- **THEN** all tile highlights are removed
