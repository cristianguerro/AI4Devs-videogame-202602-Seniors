## ADDED Requirements

### Requirement: Each player starts with correct pieces
The system SHALL place 1 Master and 4 Students per player on the board at start. Player 1 occupies row 4; Player 2 occupies row 0. Masters are in column 2 (center).

#### Scenario: Initial piece placement
- **WHEN** a new game starts
- **THEN** Player 1 has 1 Master at (2,4) and Students at (0,4),(1,4),(3,4),(4,4); Player 2 has 1 Master at (2,0) and Students at (0,0),(1,0),(3,0),(4,0)

### Requirement: Piece capture removes from board
The system SHALL remove a piece from the board when an opposing piece moves onto its cell.

#### Scenario: Student is captured
- **WHEN** a player moves a piece onto a cell occupied by an opponent's Student
- **THEN** the opponent's Student is removed from the board and the moving piece occupies that cell

#### Scenario: Master capture triggers win condition
- **WHEN** a player moves a piece onto a cell occupied by the opponent's Master
- **THEN** the opponent's Master is removed and the Way of the Stone win condition fires
