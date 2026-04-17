## MODIFIED Requirements

### Requirement: Cards are displayed in UI slots

The system SHALL display each player's 2 cards in their card slot area (bottom for Player 1, top for Player 2) and the Neutral card in a side slot. Card frames SHALL visually distinguish player slots from the neutral slot, SHALL expose a clear selected-card state, and SHALL render each card name in a readable title treatment at gameplay scale, including longer names such as Monkey and Elephant.

#### Scenario: Card slots populated

- **WHEN** the game board is rendered
- **THEN** Player 1's 2 cards are visible at the bottom, Player 2's 2 cards at the top, Neutral card on the right side, and each visible card name is legible without zooming or guessing

#### Scenario: Selected card is clearly indicated

- **WHEN** a player selects one card for a move
- **THEN** the selected card frame state is visually distinct from non-selected cards and remains visible until move execution or deselection without reducing the readability of the card name

#### Scenario: Long card names remain readable

- **WHEN** a card with a longer name is rendered in any card slot
- **THEN** the full name remains readable within the card slot using the slot's supported title layout rather than being clipped, blurred, or reduced to an illegible size
