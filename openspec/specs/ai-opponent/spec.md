## ADDED Requirements

### Requirement: AI selects a random valid move each turn
The system SHALL, when it is the AI player's turn, enumerate all valid (piece, card, destination) combinations and execute one chosen at random.

#### Scenario: AI makes a move on its turn
- **WHEN** the current phase is the AI player's turn
- **THEN** after a short delay (~500ms), the AI selects and executes a valid move

#### Scenario: AI has no valid moves
- **WHEN** the AI player has no valid moves available
- **THEN** the game handles the stalemate gracefully (skip turn or declare loss per Onitama rules)
