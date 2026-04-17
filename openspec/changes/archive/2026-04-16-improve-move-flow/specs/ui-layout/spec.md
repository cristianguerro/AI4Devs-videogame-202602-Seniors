## MODIFIED Requirements

### Requirement: UI layout places board center, cards top/bottom, neutral card right

The system SHALL position the 5x5 board in the center of the canvas, Player 1's cards at the bottom, Player 2's cards at the top, and the Neutral card on the right side. Active turn state SHALL be visually obvious without requiring label reading. The card layout SHALL reserve enough title space, spacing, and contrast treatment for players to recognize card names quickly without reducing board visibility. The gameplay layout SHALL also provide a dedicated movement preview treatment for the currently previewed or selected card without obscuring the board state.

#### Scenario: All UI elements visible on game start

- **WHEN** the GameScene renders
- **THEN** the board, both players' card slots, and the neutral card slot are all visible without overlap, and the card-title treatment does not push the layout outside the current gameplay frame

#### Scenario: Active turn is readable at a glance

- **WHEN** a turn begins for either player
- **THEN** the active player's side is highlighted with a clear visual treatment that is distinct from idle state while card names remain readable in both active and inactive slots

#### Scenario: Card titles are readable within the layout

- **WHEN** the card area is shown during normal gameplay
- **THEN** each card name has a visually distinct title region or hierarchy that separates the label from the card body and supports fast recognition

#### Scenario: Movement preview remains aligned with gameplay layout

- **WHEN** a player previews or selects a card
- **THEN** the movement preview is visible in the gameplay frame, matches the active player's orientation, and does not cover pieces or destination markers on the board

### Requirement: Valid move tiles are highlighted

The system SHALL highlight cells that are valid destinations only after the player has selected both an active card and an eligible piece. The currently active card and selected-piece state SHALL remain visually anchored while board highlights are visible.

#### Scenario: Eligible pieces appear before destination highlights

- **WHEN** a player selects a card but has not yet selected a piece
- **THEN** the board emphasizes only eligible pieces and does not yet show destination markers

#### Scenario: Highlights appear on card + piece selection

- **WHEN** a player has selected an active card and then selects an eligible piece
- **THEN** all valid destination tiles for that piece and card are visually highlighted

#### Scenario: Highlights clear on move execution or deselection

- **WHEN** a player executes a move or clears the active-card or piece selection
- **THEN** all destination highlights are removed and the board returns to the appropriate prior state for the current turn
