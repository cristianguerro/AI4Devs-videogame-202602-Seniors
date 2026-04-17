## ADDED Requirements

### Requirement: Instructional UI is available first-time and on demand
The system SHALL present a first-time instructional entry prompt for new players and SHALL provide an always-available in-game help entry point for reopening guidance on demand.

#### Scenario: First-time prompt appears for new players
- **WHEN** a player starts gameplay for the first time on a device/profile with no saved onboarding state
- **THEN** the UI shows a compact instructional entry prompt with clear options to start a quick tour or skip

#### Scenario: Help entry point is always reachable during turns
- **WHEN** gameplay is active in a player turn
- **THEN** the UI shows a help entry control that can open instructional content without requiring a page reload

#### Scenario: Guidance reflects current interaction step
- **WHEN** instructional content is open
- **THEN** the text and emphasis describe the next valid step in the current interaction flow (pick card, pick piece, pick tile)

#### Scenario: Skipping first-time prompt avoids repeated interruption
- **WHEN** a player chooses to skip onboarding
- **THEN** the first-time prompt is dismissed and does not reappear on subsequent sessions unless guidance versioning rules require it