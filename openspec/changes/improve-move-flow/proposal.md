## Why

The current move interaction is piece-first, which shows a mixed set of destinations from both cards before the player has committed to one. That makes the move intent harder to read and weakens the teaching value of the card UI at the moment when players need it most.

## What Changes

- Change the move interaction from piece-first to card-first so players choose or preview a card before choosing a piece.
- Add a movement preview treatment that shows the active card's pattern in the current player's orientation.
- Limit board emphasis to pieces that can use the active card, then to destinations for the selected piece with that card.
- Define clear cancel and switching behavior when players deselect a card, switch cards, or change the selected piece mid-turn.
- Preserve existing move legality, card swap rules, capture handling, and win conditions while making the interaction order more legible.

## Capabilities

### New Capabilities

<!-- None. -->

### Modified Capabilities

- `movement`: Change the turn interaction requirements so valid move presentation follows a card-first selection flow and supports eligible-piece emphasis before destination highlighting.
- `cards`: Change card-slot behavior so cards can be previewed or selected as the first move step and expose the chosen movement pattern clearly.
- `ui-layout`: Change the gameplay layout requirements to include movement preview affordances and updated highlight states without reducing overall board readability.

## Impact

- Affected code will primarily be the move-selection and highlight flow in GameScene, including card input handling, selection state, and board marker rendering.
- The card UI will need updated state handling for preview, active selection, and cancellation.
- The gameplay layout will need space and rules for a movement preview panel or equivalent preview treatment.
- No new dependencies or external APIs are expected.
