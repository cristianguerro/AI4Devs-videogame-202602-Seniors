## Context

The preview move box is currently positioned on the right side of the 320×180 canvas (x=293, y=90) at 44×54 pixels with 6px font. During gameplay, players find the small text difficult to read when selecting moves. The left side of the screen has available space (approximately 0-100 pixels horizontally) that is not heavily used.

Canvas layout:

- Board: 5×5 grid with 20px tiles = 100px wide, centered at ~160
- Right side: Currently has the preview panel at x=293
- Left side: Mostly empty space with room for UI elements

## Goals / Non-Goals

**Goals:**

- Make the preview move box larger and more readable (2x scale: 88×108px)
- Reposition from right side to left side for better layout balance
- Maintain the same content and interaction model (card name, grid, contextual hints)
- Ensure panel fits within the 320×180 canvas without overlapping critical elements

**Non-Goals:**

- Redesigning the preview grid content or interaction flow
- Changing the canvas resolution (staying at 320×180)
- Modifying card selection logic or move validation
- Creating additional panels or UI elements

## Decisions

**1. Panel Dimensions: 44×54 → 88×108 (2x scale)**

- Rationale: Double the size improves legibility without completely changing the aesthetic. Font appears to render more clearly at larger dimensions.
- Alternative considered: 1.5x scale (66×81). Rejected as still too small for comfortable readability.

**2. Font Size: 6px → 8px**

- Rationale: Proportional scaling from 6px to 8px matches the 2x scale of the panel. Improves character clarity without breaking the pixel-art aesthetic.
- Implementation: Both title and hint text scale from 6px to 8px with maintained line spacing.

**3. Left-Side Positioning: x=50, y=90**

- Rationale: Positions the panel on the left side with ~6px margin from canvas edge. Maintains vertical center alignment. The 88px width fits within the left margin space (0-100 range) with room to spare.
- Alternative considered: x=40 (less margin). Would be tighter but still viable.
- Alternative considered: Dynamic positioning based on current player. Rejected to keep it simple and consistent.

**4. Grid Cell Scaling: 4px cells → 8px cells**

- Rationale: Cell size scales proportionally (2x), maintaining visual proportion and readability of the move grid.
- Implementation: `cellSize: 4 → 8`, `cellGap: 1 → 2` (gaps scale proportionally).

## Risks / Trade-offs

| Risk                                                               | Mitigation                                                                                                                                      |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Panel may overlap with left-side card slots on very narrow screens | Not a concern for 320×180 target. Left card slots are positioned at board center ± offset, which is ~160±52, well to the right of x=50-138 span |
| Larger panel uses more screen real estate                          | Acceptable tradeoff for improved usability. Left side was underutilized.                                                                        |
| Font rendering at 8px might appear too large                       | Test after implementation. Can adjust to 7px if needed as intermediate step.                                                                    |
| Player 2's mirrored grid needs to work at new scale                | Existing `sign` logic in `refreshMovementPreview()` handles mirroring; scaling does not affect orientation logic.                               |

## Migration Plan

1. Update `createMovementPreviewUI()` to use new dimensions and positioning
2. Update `refreshMovementPreview()` if grid cell scaling requires it
3. Test layout at 320×180 canvas size (desktop browser)
4. Verify no overlap with card slots or board
5. Test move preview updates correctly for both players

## Open Questions

- Should the y-position remain 90 (center), or be adjusted? Keeping centered seems natural.
- If 8px font is too large, what's the fallback? (7px, or keep 6px but larger panel?)
