## MODIFIED Requirements

### Requirement: Cards are displayed in UI slots

The system SHALL display each player's 2 cards in their card slot area (bottom for Player 1, top for Player 2) and the Neutral card in a side slot. Card frames SHALL visually distinguish player slots from the neutral slot and SHALL expose a clear selected-card state.

#### Scenario: Card slots populated

- **WHEN** the game board is rendered
- **THEN** Player 1's 2 cards are visible at the bottom, Player 2's 2 cards at the top, Neutral card on the right side

#### Scenario: Selected card is clearly indicated

- **WHEN** a player selects one card for a move
- **THEN** the selected card frame state is visually distinct from non-selected cards and remains visible until move execution or deselection
