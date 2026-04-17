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
