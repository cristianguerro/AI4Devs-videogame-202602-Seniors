## 1. Update Panel Positioning and Dimensions

- [x] 1.1 Update `createMovementPreviewUI()` panelX from 293 to 50
- [x] 1.2 Update panelWidth from 44 to 88
- [x] 1.3 Update panelHeight from 54 to 108
- [x] 1.4 Adjust grid origin calculations to account for new panel size

## 2. Update Font and Text Sizing

- [x] 2.1 Update title text fontSize from "6px" to "8px"
- [x] 2.2 Update hint text fontSize from "6px" to "8px"
- [x] 2.3 Verify text remains centered and readable

## 3. Update Movement Grid Cells

- [x] 3.1 Update cellSize from 4 to 8
- [x] 3.2 Update cellGap from 1 to 2
- [x] 3.3 Verify 5×5 grid renders correctly with new cell dimensions

## 4. Test and Validate Layout

- [x] 4.1 Verify panel fits on left side without canvas overflow
- [x] 4.2 Verify no overlap with board or card slots
- [x] 4.3 Verify panel is fully visible on 320×180 canvas
- [x] 4.4 Test preview panel updates correctly when hovering/selecting cards

## 5. Test Both Player Orientations

- [x] 5.1 Test move grid orientation for Player 1 (non-mirrored)
- [x] 5.2 Test move grid orientation for Player 2 (mirrored)
- [x] 5.3 Verify contextual hints (Pick card / Preview / Pick piece / Pick tile) display correctly for both players
