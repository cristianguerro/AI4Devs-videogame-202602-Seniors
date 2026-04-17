## MODIFIED Requirements

### Requirement: Movement preview panel is prominently positioned and readable

The system SHALL display a dedicated movement preview panel positioned on the left side of the gameplay frame. The panel SHALL be 88×108 pixels with 8px font, displaying the currently previewed or selected card's name, a 5×5 grid showing valid move destinations, and contextual hints (Pick card / Preview / Pick piece / Pick tile). The panel SHALL not overlap the board or card slots.

#### Scenario: Preview panel is visible on the left side

- **WHEN** GameScene renders
- **THEN** the movement preview panel is positioned on the left side (approximately x=50) with adequate margin from the canvas edge, and is fully visible within the 320×180 canvas

#### Scenario: Preview panel text is readable

- **WHEN** a player hovers over or selects a card
- **THEN** the card name displays at 8px font with sufficient line spacing and contrast for legibility

#### Scenario: Move grid updates correctly in both player orientations

- **WHEN** Player 1 or Player 2 previews a card
- **THEN** the 5×5 grid correctly shows valid moves for that player's orientation (with Player 2's grid mirrored as appropriate)

#### Scenario: Contextual hints guide player interaction

- **WHEN** the player is in different selection states (idle / previewing / card locked / piece selected)
- **THEN** the hint text updates to show Pick card / Preview / Pick piece / Pick tile respectively

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

### Requirement: First-game choice prompt is centered with modal emphasis

The system SHALL display the first-game tutorial choice prompt at the center of the game viewport and SHALL render a dim overlay behind the prompt while onboarding choice is pending, so players clearly understand that Start or Skip selection is required.

#### Scenario: Prompt is centered when onboarding is pending

- **WHEN** onboarding state is pending and the first-game prompt is shown
- **THEN** the prompt container is rendered centered in the 320x180 game viewport

#### Scenario: Dim overlay appears behind centered prompt

- **WHEN** the first-game prompt is visible
- **THEN** a semi-transparent full-viewport overlay is rendered behind the prompt and above regular gameplay visuals

#### Scenario: Prompt and overlay dismiss together after player choice

- **WHEN** the player clicks Start or Skip
- **THEN** both the centered prompt and dim overlay are dismissed in the same interaction flow

#### Scenario: Prompt focus mode is limited to pending onboarding state

- **WHEN** onboarding is completed or skipped for the current tutorial version
- **THEN** the centered prompt and dim overlay are not shown on subsequent sessions for that same version
