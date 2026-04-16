## 1. Project Scaffold

- [ ] 1.1 Create `onitama-CFGP/index.html` with Phaser 3 CDN script tag and canvas container
- [ ] 1.2 Create `onitama-CFGP/src/` directory structure: `scenes/`, `game/`, `data/`
- [ ] 1.3 Configure Phaser game config with `pixelArt: true`, 320×180 base resolution, and FIT scale mode

## 2. Card Data

- [ ] 2.1 Create `src/data/cards.js` with all 16 official Onitama cards encoded as `{ name, moves: [{dx, dy}], stamp }`
- [ ] 2.2 Implement `dealCards()` function that randomly selects 5 distinct cards and assigns 2 to each player and 1 as Neutral

## 3. Board & Grid

- [ ] 3.1 Create `BootScene` that preloads any pixel art assets (tiles, pieces, card backgrounds)
- [ ] 3.2 Create `GameScene` and implement `createBoard()` to render a 5×5 grid of tile sprites centered on canvas
- [ ] 3.3 Visually distinguish Temple Arch tiles at (2,0) and (2,4) from normal tiles
- [ ] 3.4 Implement logical board array `board[row][col] = { piece, owner }` initialized to `null`

## 4. Pieces

- [ ] 4.1 Create piece sprites for Player 1 Master, Player 1 Student, Player 2 Master, Player 2 Student
- [ ] 4.2 Implement `placePieces()` to populate the board array and render piece sprites at correct grid positions
- [ ] 4.3 Implement `removePiece(col, row)` to destroy the Phaser sprite and clear the board cell

## 5. Movement & Input

- [ ] 5.1 Implement `getValidMoves(piece, card, player)` returning array of `{col, row}` destinations (in-bounds, no friendly piece, flip offsets for Player 2)
- [ ] 5.2 Implement tile click handler: first click selects a piece, highlights its valid move tiles per each card
- [ ] 5.3 Implement card click handler: selecting a card filters highlights to that card's valid moves only
- [ ] 5.4 Implement destination tile click handler: executes move, clears highlights, triggers card swap
- [ ] 5.5 Implement deselect on invalid tile click (clear selection and highlights)

## 6. Card Rotation

- [ ] 6.1 Implement `swapCard(player, cardIndex)` that moves the played card to the Neutral slot and the Neutral card to the player's hand
- [ ] 6.2 Update card UI slots to reflect new card positions after each swap

## 7. State Machine

- [ ] 7.1 Implement `gameState` object with `phase` field and transition functions: `startTurn()`, `beginCardTransition()`, `endCardTransition()`, `endGame(winner)`
- [ ] 7.2 Block all player input when `phase === 'TRANSITIONING_CARD'` or `phase === 'GAME_OVER'`
- [ ] 7.3 Advance turn to opposite player after card transition completes

## 8. Win Conditions

- [ ] 8.1 Implement `checkWayOfTheStone()` — detect if opponent's Master was just captured; if so, call `endGame()`
- [ ] 8.2 Implement `checkWayOfTheStream()` — detect if active player's Master just moved to opponent's Temple Arch; if so, call `endGame()`
- [ ] 8.3 Call both checks after every move execution

## 9. AI Opponent

- [ ] 9.1 Implement `getAIMove()` that enumerates all valid (piece, card, destination) triples for the AI player and returns one at random
- [ ] 9.2 Trigger `getAIMove()` after a 500ms delay when the state machine enters the AI player's turn
- [ ] 9.3 Handle the case where the AI has no valid moves (skip turn or declare loss)

## 10. UI Layout & Polish

- [ ] 10.1 Render Player 1's card slots at the bottom of the canvas and Player 2's at the top
- [ ] 10.2 Render the Neutral card slot on the right side of the canvas
- [ ] 10.3 Show current turn indicator (e.g., highlight the active player's side)
- [ ] 10.4 Create `GameOverScene` that displays the winner and a "Play Again" button that restarts `GameScene`

## 11. Integration & Testing

- [ ] 11.1 Play through a full match verifying card rotation is correct each turn
- [ ] 11.2 Verify Way of the Stone win condition triggers correctly
- [ ] 11.3 Verify Way of the Stream win condition triggers correctly
- [ ] 11.4 Verify AI makes a move each turn without console errors
- [ ] 11.5 Verify no console errors occur across a complete game from start to finish
