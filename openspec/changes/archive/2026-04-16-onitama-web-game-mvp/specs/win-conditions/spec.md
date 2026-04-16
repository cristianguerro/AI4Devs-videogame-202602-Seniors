## ADDED Requirements

### Requirement: Way of the Stone ends the game
The system SHALL end the game when a player captures the opponent's Master piece.

#### Scenario: Master captured
- **WHEN** a move results in the opponent's Master piece being removed from the board
- **THEN** the game phase transitions to `GAME_OVER` and the capturing player is declared the winner

### Requirement: Way of the Stream ends the game
The system SHALL end the game when a player's Master moves onto the opponent's Temple Arch cell (center of the opponent's back row).

#### Scenario: Master reaches opponent's Temple Arch
- **WHEN** Player 1's Master moves to cell (2,0) or Player 2's Master moves to cell (2,4)
- **THEN** the game phase transitions to `GAME_OVER` and that player is declared the winner
