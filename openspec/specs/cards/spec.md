## ADDED Requirements

### Requirement: 5 cards are randomly selected per game
The system SHALL randomly select 5 cards from the full card pool at game start. Player 1 receives 2, Player 2 receives 2, and 1 becomes the Neutral card.

#### Scenario: Card deal on new game
- **WHEN** a new game starts
- **THEN** exactly 5 distinct cards are selected, 2 assigned to Player 1, 2 to Player 2, 1 marked as Neutral

### Requirement: Cards are displayed in UI slots
The system SHALL display each player's 2 cards in their card slot area (bottom for Player 1, top for Player 2) and the Neutral card in a side slot.

#### Scenario: Card slots populated
- **WHEN** the game board is rendered
- **THEN** Player 1's 2 cards are visible at the bottom, Player 2's 2 cards at the top, Neutral card on the right side

### Requirement: Used card is swapped with Neutral after each turn
The system SHALL swap the played card with the Neutral card at the end of each turn.

#### Scenario: Card rotation after move
- **WHEN** a player completes a move using a card
- **THEN** that card moves to the Neutral slot and the previous Neutral card moves to that player's hand
