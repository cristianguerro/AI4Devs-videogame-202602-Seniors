## ADDED Requirements

### Requirement: Visual assets follow a normalized file and key contract

The system SHALL load board, piece, marker, and UI textures from a dedicated asset structure with stable naming and texture keys.

#### Scenario: Asset naming contract is applied

- **WHEN** new visual assets are added for Pixel-Tama
- **THEN** each file uses the defined naming convention and maps to a unique Phaser texture key by category (board, pieces, markers, ui)

### Requirement: Asset dimensions and pixel rendering rules are enforced

The system SHALL enforce a consistent source-size and pixel-rendering policy for all game art used in runtime scenes.

#### Scenario: Sprite consistency validation

- **WHEN** assets are loaded in BootScene and rendered in GameScene
- **THEN** pieces, tiles, and markers render at expected scale without smoothing artifacts or inconsistent pixel density

### Requirement: Contrast budget protects gameplay readability

The system SHALL preserve a contrast budget where playable pieces and active markers remain visually dominant over board textures.

#### Scenario: Readability preserved on all board cells

- **WHEN** pieces and markers are rendered on both normal and temple tiles
- **THEN** selected piece state, owner identity, and valid/capture destinations remain distinguishable at gameplay scale
