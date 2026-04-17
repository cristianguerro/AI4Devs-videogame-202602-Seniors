## MODIFIED Requirements

### Requirement: UI layout places board center, cards top/bottom, neutral card right
The system SHALL position the 5x5 board in the center of the canvas, Player 1's cards at the bottom, Player 2's cards at the top, and the Neutral card on the right side. Active turn state SHALL be visually obvious without requiring label reading.

#### Scenario: All UI elements visible on game start
- **WHEN** the GameScene renders
- **THEN** the board, both players' card slots, and the neutral card slot are all visible without overlap

#### Scenario: Active turn is readable at a glance
- **WHEN** a turn begins for either player
- **THEN** the active player's side is highlighted with a clear visual treatment that is distinct from idle state

### Requirement: Valid move tiles are highlighted
The system SHALL highlight cells that are valid destinations when the player has selected a piece and a card. The selected-piece state SHALL remain visually anchored while highlights are visible.

#### Scenario: Highlights appear on piece + card selection
- **WHEN** a player selects a piece and a card
- **THEN** all valid destination tiles are visually highlighted (e.g., tinted or overlaid)

#### Scenario: Highlights clear on move execution or deselection
- **WHEN** a player executes a move or clicks to deselect
- **THEN** all tile highlights are removed
