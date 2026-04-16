## ADDED Requirements

### Requirement: Valid moves are calculated from selected piece and card
The system SHALL compute all valid destination cells for a selected piece given a selected card, filtering out out-of-bounds cells and cells occupied by friendly pieces.

#### Scenario: Moves computed within bounds
- **WHEN** a piece and card are selected
- **THEN** only destinations within the 5×5 grid that are not occupied by a friendly piece are highlighted

#### Scenario: Player 2 moves are mirrored
- **WHEN** it is Player 2's turn and a card and piece are selected
- **THEN** the card offsets are negated (flipped) to reflect Player 2's orientation

### Requirement: Move execution updates board state
The system SHALL update the logical board state and Phaser visuals when a valid move is made.

#### Scenario: Piece moves to empty cell
- **WHEN** a player selects a valid destination cell
- **THEN** the piece's position updates in the board array and its Phaser object moves to the new cell

#### Scenario: Move to occupied enemy cell captures the piece
- **WHEN** a player selects a destination occupied by an opponent's piece
- **THEN** the opponent's piece is removed and the moving piece occupies that cell
