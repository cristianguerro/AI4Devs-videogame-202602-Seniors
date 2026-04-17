## Context

Pixel-Tama is currently playable but relies on placeholder pixel blocks for tiles, pieces, and most interaction markers. This causes low gameplay readability: players struggle to identify piece roles quickly and to parse selected/valid/capture states during turns. The game is a client-side Phaser 3 project with a compact 320x180 base resolution and FIT scaling, which magnifies the impact of small visual decisions.

This change spans multiple modules (boot asset loading, scene rendering, interaction state visuals, and card UI framing), so explicit design decisions are needed before implementation.

## Goals / Non-Goals

**Goals:**
- Introduce a minimal-modern pixel-art asset set that improves tactical readability.
- Enforce silhouette-first piece design (master vs student and player ownership).
- Make interaction states (selected piece, valid move, capture move, selected card, active turn) immediately distinguishable.
- Keep visual polish subtle and tactical (short, low-noise feedback effects).
- Define a repeatable asset pipeline contract for future additions.

**Non-Goals:**
- No new gameplay rules or win conditions.
- No online features, persistence, or backend changes.
- No advanced animation systems or VFX-heavy presentation.
- No broad UI redesign outside clarity-related elements.

## Decisions

1. **Adopt a dedicated asset namespace and folder structure**
- Decision: Use a dedicated assets tree (board, pieces, markers, ui) and explicit texture keys in scene code.
- Rationale: Prevents ad-hoc naming and keeps rendering references maintainable.
- Alternative considered: Keep inline/generated 1x1 pixel tints only.
- Why not: Placeholder style limits readability and visual consistency.

2. **Silhouette-first piece rendering with outline constraint**
- Decision: Piece assets must include clear silhouettes and a dark 1px outline, with masters visually distinct by shape first (not only color).
- Rationale: At low resolution, silhouette communicates role faster than internal detail.
- Alternative considered: Differentiate mostly by color and size.
- Why not: Fails under low contrast or peripheral viewing.

3. **Marker taxonomy for interaction clarity**
- Decision: Use separate marker assets and styles for selected, valid, and capture states; enforce both color and shape distinction for valid vs capture.
- Rationale: Reduces move-selection errors and cognitive load.
- Alternative considered: Single marker with color tint variations.
- Why not: Harder to parse quickly, especially for color-impaired users.

4. **Minimal-modern animation envelope**
- Decision: Keep feedback timings short and subtle (selection pulse, move pop, capture flash, card swap slide) with no large particle systems.
- Rationale: Preserves tactical focus while adding responsiveness.
- Alternative considered: More dramatic arcade-style effects.
- Why not: Visual noise competes with decision-making cues.

5. **Contrast budget and palette governance**
- Decision: Define board tiles in a mid-dark luminance band and reserve brighter values for pieces and active markers.
- Rationale: Guarantees piece visibility and state prominence.
- Alternative considered: Decorative high-contrast tiles.
- Why not: Board detail can overpower tokens and markers.

## Risks / Trade-offs

- **[Risk] Asset production overhead delays coding** -> Mitigation: Stage implementation in small asset sprints (pieces/board first, markers second, polish third).
- **[Risk] Over-minimal art appears flat or generic** -> Mitigation: Use subtle motif details on temple tile and restrained, consistent accent palette.
- **[Risk] New assets introduce render-size mismatch artifacts** -> Mitigation: Standardize source sizes and test at intended game scale after each batch.
- **[Risk] Marker redesign could conflict with existing hit logic assumptions** -> Mitigation: Treat markers as visual-only overlays; keep input mapping tied to logical board coordinates.
