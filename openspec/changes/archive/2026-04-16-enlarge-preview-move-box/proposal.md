## Why

The preview move box is currently 44×54 pixels with 6px font, making it difficult to read and interact with during gameplay. Players struggle to see which moves are available when selecting cards and pieces. Enlarging and repositioning it improves usability without adding new complexity.

## What Changes

- Enlarge the preview move box from 44×54px to 88×108px (2x scale)
- Reposition from the right side of the board to the left side
- Keep the same content: card name, move grid visualization, and contextual hints
- Improve font rendering at larger size for better readability

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `ui-layout`: Move preview panel repositioned from right to left side of board, with increased dimensions for improved readability and interaction

## Impact

- **GameScene.js**: Preview panel positioning, dimensions, and rendering logic
- **Main rendering**: Panel must fit within the 320×180 canvas alongside the game board and other UI elements
- **Responsive interaction**: Better visual feedback during move selection phase
