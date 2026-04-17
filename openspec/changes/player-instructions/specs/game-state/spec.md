## ADDED Requirements

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