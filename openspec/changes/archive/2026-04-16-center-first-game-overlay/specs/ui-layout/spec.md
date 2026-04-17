## ADDED Requirements

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
