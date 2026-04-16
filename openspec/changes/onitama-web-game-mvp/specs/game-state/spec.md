## ADDED Requirements

### Requirement: Game progresses through defined phases
The system SHALL manage game flow through the phases: `PLAYER_1_TURN`, `PLAYER_2_TURN`, `TRANSITIONING_CARD`, and `GAME_OVER`.

#### Scenario: Turn advances after move
- **WHEN** a player completes a valid move
- **THEN** the phase transitions to `TRANSITIONING_CARD`, then to the other player's turn

#### Scenario: Input is blocked during transition
- **WHEN** the phase is `TRANSITIONING_CARD`
- **THEN** no player input is accepted until the card swap animation completes and the phase advances

#### Scenario: Game over phase locks input
- **WHEN** the phase is `GAME_OVER`
- **THEN** no further moves are accepted and the game-over screen is shown
