## ADDED Requirements

### Requirement: 5x5 grid is rendered
The system SHALL render a 5×5 grid as the game board, with each cell visually distinct and addressable by (col, row) coordinates (0-indexed, origin top-left).

#### Scenario: Board renders on game start
- **WHEN** the GameScene is created
- **THEN** a 5×5 grid of tiles is displayed centered on screen

#### Scenario: Temple Arch tiles are visually marked
- **WHEN** the board is rendered
- **THEN** the center cell of row 0 (Player 1's temple) and center cell of row 4 (Player 2's temple) are visually distinguished from normal tiles
