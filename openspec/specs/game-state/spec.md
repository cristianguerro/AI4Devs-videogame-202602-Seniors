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

### Requirement: Onboarding and help preferences persist across sessions
The system SHALL persist onboarding/help state locally, including whether first-time guidance was skipped or completed, and a tutorial content version identifier used to decide whether guidance should be shown again.

#### Scenario: New player state defaults to onboarding pending
- **WHEN** no prior onboarding/help persistence data exists
- **THEN** the game state treats onboarding as pending and allows first-time instructional entry

#### Scenario: Completion state is persisted
- **WHEN** a player completes the quick tutorial flow
- **THEN** game state persistence records tutorial completion and subsequent sessions do not show first-time entry prompt for the same tutorial version

#### Scenario: Skip state is persisted
- **WHEN** a player skips first-time guidance
- **THEN** game state persistence records skip and subsequent sessions do not show first-time entry prompt for the same tutorial version

#### Scenario: Version change re-enables onboarding
- **WHEN** the stored tutorial version differs from the current tutorial version
- **THEN** game state treats onboarding as pending for the new version and allows first-time instructional entry again
