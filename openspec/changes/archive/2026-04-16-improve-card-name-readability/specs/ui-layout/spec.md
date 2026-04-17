## MODIFIED Requirements

### Requirement: UI layout places board center, cards top/bottom, neutral card right

The system SHALL position the 5x5 board in the center of the canvas, Player 1's cards at the bottom, Player 2's cards at the top, and the Neutral card on the right side. Active turn state SHALL be visually obvious without requiring label reading. The card layout SHALL reserve enough title space, spacing, and contrast treatment for players to recognize card names quickly without reducing board visibility.

#### Scenario: All UI elements visible on game start

- **WHEN** the GameScene renders
- **THEN** the board, both players' card slots, and the neutral card slot are all visible without overlap, and the card-title treatment does not push the layout outside the current gameplay frame

#### Scenario: Active turn is readable at a glance

- **WHEN** a turn begins for either player
- **THEN** the active player's side is highlighted with a clear visual treatment that is distinct from idle state while card names remain readable in both active and inactive slots

#### Scenario: Card titles are readable within the layout

- **WHEN** the card area is shown during normal gameplay
- **THEN** each card name has a visually distinct title region or hierarchy that separates the label from the card body and supports fast recognition
