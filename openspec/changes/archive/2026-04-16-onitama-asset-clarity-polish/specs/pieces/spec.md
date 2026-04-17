## MODIFIED Requirements

### Requirement: Each player starts with correct pieces
The system SHALL place 1 Master and 4 Students per player on the board at start. Player 1 occupies row 4; Player 2 occupies row 0. Masters are in column 2 (center). Piece visuals SHALL use silhouette-first sprites with clear owner differentiation and a visible outline at gameplay scale.

#### Scenario: Initial piece placement
- **WHEN** a new game starts
- **THEN** Player 1 has 1 Master at (2,4) and Students at (0,4),(1,4),(3,4),(4,4); Player 2 has 1 Master at (2,0) and Students at (0,0),(1,0),(3,0),(4,0)

#### Scenario: Piece readability at gameplay scale
- **WHEN** all starting pieces are rendered on the board
- **THEN** players can visually distinguish master vs student and Player 1 vs Player 2 without relying on debug text or tooltips
