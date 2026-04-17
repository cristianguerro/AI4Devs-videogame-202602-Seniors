## Context

The current card UI in [onitama-CFGP/src/scenes/GameScene.js](/home/cris/repos/AI4Devs-videogame-202602-Seniors/onitama-CFGP/src/scenes/GameScene.js) renders card names as a single centered text node on top of a small slot background. In practice, longer names such as Goose, Monkey, and Elephant become hard to parse because the text size is too small, the label does not have a dedicated title region, and the contrast between text and card surfaces is modest. The board-centered layout is otherwise working, so the change should improve card readability without pushing cards farther away from the board or adding new systems.

## Goals / Non-Goals

**Goals:**

- Make every card name readable at gameplay distance, including the longest current names.
- Preserve the existing board-centered composition and slot ownership model.
- Keep selected-card and active-turn states visually clear after the card presentation changes.
- Use deterministic layout rules that stay crisp in a pixel-art UI.

**Non-Goals:**

- Redesign the entire HUD or move cards to a different side of the screen.
- Add new gameplay metadata, icons, or card-detail popovers.
- Replace the current rendering stack or introduce new dependencies.

## Decisions

### Decision: Give each card a dedicated title band inside the existing slot footprint

The card label will move from a generic centered placement to a dedicated title area within the slot. This creates a clearer reading region and separates the card name from the rest of the card surface.

Alternatives considered:

- Increase the overall card size. Rejected because it would compete with the centered board layout and reduce spacing flexibility on the current canvas.
- Keep the same card layout and only change font size. Rejected because the current composition does not reserve enough clean space for larger labels.

### Decision: Use fixed readability rules for long names instead of freeform scaling

Card names should render using a predictable set of layouts, such as a larger single-line treatment for short names and a controlled two-line treatment for longer names. This avoids the blurry, inconsistent look that can happen when text is continuously scaled to fit.

Alternatives considered:

- Shrink text until every name fits on one line. Rejected because it would keep long names readable only in theory, not in practice.
- Abbreviate card names. Rejected because card names are core game identifiers and should remain fully visible.

### Decision: Increase contrast with a clearer label hierarchy, not just brighter text

The slot should use a stronger separation between frame, title band, and body so the name is readable even when the card is idle. Selected and active states should layer on top of that hierarchy rather than being the only source of contrast.

Alternatives considered:

- Add only an outline or shadow to the current text. Rejected because it improves edges but does not solve the lack of structure behind the label.
- Use stronger state tints alone. Rejected because idle cards must still be readable before interaction.

### Decision: Limit the implementation to GameScene card UI composition and styling hooks

The change should stay inside the current card rendering path in GameScene, reusing the existing slot ownership and turn-refresh flow. If supporting assets are needed, they should remain optional and fit the current texture fallback approach.

Alternatives considered:

- Create a new reusable UI system for all HUD elements. Rejected because this change is narrow and does not justify a broader refactor.

## Risks / Trade-offs

- [Long names still feel crowded in narrow slots] -> Use an explicit two-line layout with centered spacing and validate against the longest current card names.
- [Higher contrast title areas could weaken the minimal visual style] -> Keep the palette aligned with the existing neutral card/frame tones and use contrast primarily in value separation, not saturation spikes.
- [State highlights may clash with the new title treatment] -> Preserve selected and active state overlays as outer-frame or background changes, leaving the title text readable in every state.
- [Future card names may exceed current length expectations] -> Define fitting rules around the longest names already in the shipped card set and keep the layout logic isolated for later extension.
