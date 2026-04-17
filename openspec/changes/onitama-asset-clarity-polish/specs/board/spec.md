## MODIFIED Requirements

### Requirement: 5x5 grid is rendered
The system SHALL render a 5x5 grid as the game board, with each cell visually distinct and addressable by (col, row) coordinates (0-indexed, origin top-left). Board tile art SHALL maintain low visual noise so pieces and markers remain the primary focus.

#### Scenario: Board renders on game start
- **WHEN** the GameScene is created
- **THEN** a 5x5 grid of tiles is displayed centered on screen

#### Scenario: Temple Arch tiles are visually marked
- **WHEN** the board is rendered
- **THEN** the center cell of row 0 (Player 1's temple) and center cell of row 4 (Player 2's temple) are visually distinguished from normal tiles

#### Scenario: Board textures do not reduce tactical readability
- **WHEN** pieces and move markers are shown on normal and temple tiles
- **THEN** board texture contrast remains subordinate to piece and marker readability
