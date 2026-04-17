## 1. Turn State Refactor

- [x] 1.1 Replace the current piece-first selection state in GameScene with explicit card preview, active card, eligible piece, and resolving-move states
- [x] 1.2 Preserve existing move legality, mirrored Player 2 orientation, capture handling, and card swap behavior while routing move setup through the new card-first flow
- [x] 1.3 Update clear-selection and turn-start logic so cancelling a card or piece returns the board to the correct prior state

## 2. Card Interaction

- [x] 2.1 Update card slot input handling so cards can be previewed before commitment and locked as the active card for the turn
- [x] 2.2 Implement switching and cancellation behavior for active-card selection across pointer and touch-friendly interactions
- [x] 2.3 Keep selected-card and title readability states visually clear while the card-first flow is active

## 3. Board Guidance And Preview UI

- [x] 3.1 Add eligible-piece emphasis that appears after a card becomes active and only marks pieces with at least one legal move for that card
- [x] 3.2 Change destination highlighting so it appears only after an eligible piece is selected and keeps capture destinations visually distinct
- [x] 3.3 Add a dedicated movement preview treatment that shows the previewed or selected card pattern in the active player's orientation without obscuring the board

## 4. Layout Integration And Regression Checks

- [x] 4.1 Fit the movement preview and updated highlight states into the current gameplay layout without overlapping the board, neutral card, or turn indicators
- [x] 4.2 Verify the new flow works for both players, including mirrored orientation, switching cards mid-turn, changing pieces, cancelling selection, and executing capture moves
- [x] 4.3 Run a gameplay smoke test to confirm the turn still ends correctly, the played card still swaps with the neutral card, and win conditions still trigger as before
