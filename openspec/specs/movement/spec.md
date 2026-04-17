## MODIFIED Requirements

### Requirement: Valid moves are calculated from selected piece and card

The system SHALL compute all valid destination cells for a selected piece given a selected card, filtering out out-of-bounds cells and cells occupied by friendly pieces. Visual markers for valid and capture destinations SHALL be distinguishable by both color and shape.

#### Scenario: Moves computed within bounds

- **WHEN** a piece and card are selected
- **THEN** only destinations within the 5x5 grid that are not occupied by a friendly piece are highlighted

#### Scenario: Player 2 moves are mirrored

- **WHEN** it is Player 2's turn and a card and piece are selected
- **THEN** the card offsets are negated (flipped) to reflect Player 2's orientation

#### Scenario: Capture opportunities are clearly differentiated

- **WHEN** at least one valid destination contains an opponent piece
- **THEN** capture destinations are visually distinct from non-capture valid moves
