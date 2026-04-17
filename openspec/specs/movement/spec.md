## MODIFIED Requirements

### Requirement: Valid moves are calculated from selected piece and card

The system SHALL support a card-first move flow where the player previews or selects a card before selecting a piece. After a card is active, the system SHALL indicate only pieces that can legally use that card, and after one eligible piece is selected, the system SHALL compute valid destination cells for that piece and card, filtering out out-of-bounds cells and cells occupied by friendly pieces. Visual markers for eligible pieces, valid destinations, and capture destinations SHALL remain distinguishable from one another.

#### Scenario: Eligible pieces are shown after card selection

- **WHEN** a player selects a card at the start of their turn
- **THEN** the board indicates only the current player's pieces that have at least one legal move using that card

#### Scenario: Destinations are shown after eligible piece selection

- **WHEN** a player selects one of the eligible pieces for the active card
- **THEN** only destinations that are legal for that piece with that card are highlighted

#### Scenario: Player 2 moves are mirrored

- **WHEN** it is Player 2's turn and a card becomes active
- **THEN** the movement preview and computed destinations use the mirrored card offsets that match Player 2's board orientation

#### Scenario: Capture opportunities are clearly differentiated

- **WHEN** at least one valid destination for the active piece and card contains an opponent piece
- **THEN** capture destinations are visually distinct from non-capture valid moves
