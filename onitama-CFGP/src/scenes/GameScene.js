import { dealCards } from "../data/cards.js";

const BOARD_SIZE = 5;
const TILE_SIZE = 20;
const OWNER = {
  PLAYER_1: "PLAYER_1",
  PLAYER_2: "PLAYER_2",
};
const PHASE = {
  PLAYER_1_TURN: "PLAYER_1_TURN",
  PLAYER_2_TURN: "PLAYER_2_TURN",
  TRANSITIONING_CARD: "TRANSITIONING_CARD",
  GAME_OVER: "GAME_OVER",
};

function inBounds(col, row) {
  return col >= 0 && col < BOARD_SIZE && row >= 0 && row < BOARD_SIZE;
}

function phaseForPlayer(player) {
  return player === OWNER.PLAYER_1 ? PHASE.PLAYER_1_TURN : PHASE.PLAYER_2_TURN;
}

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  init(data) {
    this.aiEnabled = data?.aiEnabled ?? true;
    this.aiPlayer = OWNER.PLAYER_2;
  }

  create() {
    this.scene.stop("GameOverScene");

    this.boardStartX = (this.scale.width - BOARD_SIZE * TILE_SIZE) / 2;
    this.boardStartY = (this.scale.height - BOARD_SIZE * TILE_SIZE) / 2;

    this.board = Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => null)
    );
    this.tileSprites = Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => null)
    );
    this.highlightSprites = [];

    this.selectedPiece = null;
    this.selectedCardIndex = null;
    this.validMovesForSelection = [];
    this.cardUi = { player1: [], player2: [], neutral: null };

    this.cards = dealCards();
    this.currentPlayer = OWNER.PLAYER_1;

    this.gameState = {
      phase: PHASE.PLAYER_1_TURN,
      winner: null,
      startTurn: (player) => {
        this.currentPlayer = player;
        this.gameState.phase = phaseForPlayer(player);
        this.selectedPiece = null;
        this.selectedCardIndex = null;
        this.clearHighlights();
        this.refreshTurnIndicator();
        if (this.aiEnabled && this.currentPlayer === this.aiPlayer) {
          this.scheduleAITurn();
        }
      },
      beginCardTransition: () => {
        this.gameState.phase = PHASE.TRANSITIONING_CARD;
      },
      endCardTransition: () => {
        if (this.gameState.phase === PHASE.GAME_OVER) {
          return;
        }
        const nextPlayer =
          this.currentPlayer === OWNER.PLAYER_1 ? OWNER.PLAYER_2 : OWNER.PLAYER_1;
        this.gameState.startTurn(nextPlayer);
      },
      endGame: (winner) => {
        this.gameState.phase = PHASE.GAME_OVER;
        this.gameState.winner = winner;
        this.scene.start("GameOverScene", { winner: winner.replace("_", " ") });
      },
    };

    this.createBoard();
    this.placePieces();
    this.createCardUI();
    this.createTurnIndicator();
    this.refreshCardUI();
    this.refreshTurnIndicator();
  }

  createBoard() {
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const x = this.boardStartX + col * TILE_SIZE + TILE_SIZE / 2;
        const y = this.boardStartY + row * TILE_SIZE + TILE_SIZE / 2;

        const tile = this.add
          .image(x, y, "pixel")
          .setDisplaySize(TILE_SIZE - 2, TILE_SIZE - 2)
          .setTint(this.isTempleArch(col, row) ? 0x4d6e47 : 0x3e3a36)
          .setInteractive({ useHandCursor: true });

        tile.setData("col", col);
        tile.setData("row", row);
        tile.on("pointerdown", () => this.handleTileClick(col, row));

        this.tileSprites[row][col] = tile;
      }
    }
  }

  isTempleArch(col, row) {
    return (col === 2 && row === 0) || (col === 2 && row === 4);
  }

  createPieceSprite(owner, type, col, row) {
    const x = this.boardStartX + col * TILE_SIZE + TILE_SIZE / 2;
    const y = this.boardStartY + row * TILE_SIZE + TILE_SIZE / 2;

    const color =
      owner === OWNER.PLAYER_1
        ? type === "MASTER"
          ? 0xffcc66
          : 0xe98e3b
        : type === "MASTER"
        ? 0x88ddff
        : 0x4f97d9;

    const sprite = this.add
      .image(x, y, "pixel")
      .setDisplaySize(type === "MASTER" ? 16 : 13, type === "MASTER" ? 16 : 13)
      .setTint(color)
      .setDepth(5);

    return sprite;
  }

  placePieces() {
    const setup = [
      { owner: OWNER.PLAYER_2, row: 0 },
      { owner: OWNER.PLAYER_1, row: 4 },
    ];

    for (const side of setup) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const type = col === 2 ? "MASTER" : "STUDENT";
        const sprite = this.createPieceSprite(side.owner, type, col, side.row);
        this.board[side.row][col] = {
          owner: side.owner,
          piece: {
            type,
            owner: side.owner,
            col,
            row: side.row,
            sprite,
          },
        };
      }
    }
  }

  removePiece(col, row) {
    const cell = this.board[row][col];
    if (!cell) {
      return null;
    }
    cell.piece.sprite.destroy();
    this.board[row][col] = null;
    return cell.piece;
  }

  activePlayerCards() {
    return this.currentPlayer === OWNER.PLAYER_1 ? this.cards.player1 : this.cards.player2;
  }

  getValidMoves(piece, card, player) {
    const sign = player === OWNER.PLAYER_1 ? 1 : -1;
    const moves = [];

    for (const step of card.moves) {
      const col = piece.col + step.dx * sign;
      const row = piece.row + step.dy * sign;
      if (!inBounds(col, row)) {
        continue;
      }
      const occupant = this.board[row][col];
      if (occupant && occupant.owner === player) {
        continue;
      }
      moves.push({ col, row });
    }

    return moves;
  }

  handleTileClick(col, row) {
    if (
      this.gameState.phase === PHASE.TRANSITIONING_CARD ||
      this.gameState.phase === PHASE.GAME_OVER
    ) {
      return;
    }

    const clickedCell = this.board[row][col];

    if (this.selectedPiece && this.selectedCardIndex !== null) {
      const match = this.validMovesForSelection.find((m) => m.col === col && m.row === row);
      if (match) {
        this.executeMove(col, row);
        return;
      }
    }

    if (clickedCell && clickedCell.owner === this.currentPlayer) {
      this.selectedPiece = clickedCell.piece;
      this.selectedCardIndex = null;
      this.showAllValidMovesForSelectedPiece();
      this.refreshCardUI();
      return;
    }

    this.clearSelection();
  }

  showAllValidMovesForSelectedPiece() {
    this.clearHighlights();
    if (!this.selectedPiece) {
      return;
    }

    const byKey = new Map();
    this.activePlayerCards().forEach((card, cardIndex) => {
      this.getValidMoves(this.selectedPiece, card, this.currentPlayer).forEach((move) => {
        const key = `${move.col}:${move.row}`;
        const existing = byKey.get(key) ?? { ...move, cardIndexes: [] };
        existing.cardIndexes.push(cardIndex);
        byKey.set(key, existing);
      });
    });

    this.validMovesForSelection = [...byKey.values()];
    this.renderHighlights();
  }

  filterMovesBySelectedCard() {
    this.clearHighlights();
    if (!this.selectedPiece || this.selectedCardIndex === null) {
      return;
    }

    const card = this.activePlayerCards()[this.selectedCardIndex];
    this.validMovesForSelection = this.getValidMoves(
      this.selectedPiece,
      card,
      this.currentPlayer
    ).map((m) => ({ ...m, cardIndexes: [this.selectedCardIndex] }));

    this.renderHighlights();
  }

  renderHighlights() {
    this.clearHighlights();
    for (const move of this.validMovesForSelection) {
      const x = this.boardStartX + move.col * TILE_SIZE + TILE_SIZE / 2;
      const y = this.boardStartY + move.row * TILE_SIZE + TILE_SIZE / 2;
      const marker = this.add
        .image(x, y, "pixel")
        .setDisplaySize(TILE_SIZE - 8, TILE_SIZE - 8)
        .setTint(0xd6bb59)
        .setAlpha(0.75)
        .setDepth(2);
      this.highlightSprites.push(marker);
    }
  }

  clearHighlights() {
    this.highlightSprites.forEach((s) => s.destroy());
    this.highlightSprites = [];
  }

  clearSelection() {
    this.selectedPiece = null;
    this.selectedCardIndex = null;
    this.validMovesForSelection = [];
    this.clearHighlights();
    this.refreshCardUI();
  }

  createCardUI() {
    const createCardSlot = (x, y, owner, index) => {
      const bg = this.add
        .rectangle(x, y, 52, 28, 0x2e2a28)
        .setStrokeStyle(2, 0x6f6458)
        .setInteractive({ useHandCursor: true });
      const label = this.add
        .text(x, y, "", { fontSize: "8px", color: "#f4ead5", align: "center" })
        .setOrigin(0.5);

      bg.on("pointerdown", () => {
        if (owner !== this.currentPlayer) {
          return;
        }
        if (!this.selectedPiece) {
          return;
        }
        this.selectedCardIndex = index;
        this.filterMovesBySelectedCard();
        this.refreshCardUI();
      });

      return { bg, label, owner, index };
    };

    this.cardUi.player2.push(createCardSlot(110, 18, OWNER.PLAYER_2, 0));
    this.cardUi.player2.push(createCardSlot(170, 18, OWNER.PLAYER_2, 1));
    this.cardUi.player1.push(createCardSlot(110, 162, OWNER.PLAYER_1, 0));
    this.cardUi.player1.push(createCardSlot(170, 162, OWNER.PLAYER_1, 1));

    const neutralBg = this.add.rectangle(292, 90, 48, 30, 0x41372f).setStrokeStyle(2, 0xbda170);
    const neutralLabel = this.add
      .text(292, 90, "", { fontSize: "8px", color: "#fff6dc", align: "center" })
      .setOrigin(0.5);
    this.cardUi.neutral = { bg: neutralBg, label: neutralLabel };
  }

  refreshCardUI() {
    const updateSlots = (slots, cards, isCurrentPlayer) => {
      slots.forEach((slot, index) => {
        const card = cards[index];
        slot.label.setText(card ? card.name : "-");
        slot.bg.setFillStyle(0x2e2a28);

        if (isCurrentPlayer && this.selectedPiece) {
          slot.bg.setStrokeStyle(2, 0xf1cf74);
        } else {
          slot.bg.setStrokeStyle(2, 0x6f6458);
        }

        if (isCurrentPlayer && this.selectedCardIndex === index) {
          slot.bg.setFillStyle(0x5a4831);
          slot.bg.setStrokeStyle(2, 0xf5e8bf);
        }
      });
    };

    updateSlots(
      this.cardUi.player1,
      this.cards.player1,
      this.currentPlayer === OWNER.PLAYER_1
    );
    updateSlots(
      this.cardUi.player2,
      this.cards.player2,
      this.currentPlayer === OWNER.PLAYER_2
    );

    this.cardUi.neutral.label.setText(this.cards.neutral.name);
  }

  createTurnIndicator() {
    this.turnP1 = this.add.rectangle(28, 162, 42, 24, 0x3a3129).setStrokeStyle(2, 0x6f6458);
    this.turnP2 = this.add.rectangle(28, 18, 42, 24, 0x3a3129).setStrokeStyle(2, 0x6f6458);

    this.add
      .text(28, 162, "P1", { fontSize: "10px", color: "#f7eacc" })
      .setOrigin(0.5)
      .setDepth(10);
    this.add
      .text(28, 18, "P2", { fontSize: "10px", color: "#f7eacc" })
      .setOrigin(0.5)
      .setDepth(10);
  }

  refreshTurnIndicator() {
    const p1Active = this.currentPlayer === OWNER.PLAYER_1;
    this.turnP1.setFillStyle(p1Active ? 0x6b4d2f : 0x3a3129).setStrokeStyle(2, p1Active ? 0xf2d285 : 0x6f6458);
    this.turnP2
      .setFillStyle(!p1Active ? 0x425a6f : 0x3a3129)
      .setStrokeStyle(2, !p1Active ? 0x9fdbff : 0x6f6458);
    this.refreshCardUI();
  }

  executeMove(targetCol, targetRow) {
    const originCol = this.selectedPiece.col;
    const originRow = this.selectedPiece.row;
    const movingPiece = this.selectedPiece;
    const player = movingPiece.owner;

    let captured = null;
    if (this.board[targetRow][targetCol]) {
      captured = this.removePiece(targetCol, targetRow);
    }

    this.board[originRow][originCol] = null;
    this.board[targetRow][targetCol] = {
      owner: movingPiece.owner,
      piece: movingPiece,
    };
    movingPiece.col = targetCol;
    movingPiece.row = targetRow;
    movingPiece.sprite.setPosition(
      this.boardStartX + targetCol * TILE_SIZE + TILE_SIZE / 2,
      this.boardStartY + targetRow * TILE_SIZE + TILE_SIZE / 2
    );

    const selectedCard = this.selectedCardIndex;
    this.clearSelection();

    if (this.checkWayOfTheStone(captured, player)) {
      return;
    }
    if (this.checkWayOfTheStream(movingPiece, player)) {
      return;
    }

    this.gameState.beginCardTransition();
    this.swapCard(player, selectedCard);
    this.time.delayedCall(250, () => {
      this.gameState.endCardTransition();
    });
  }

  swapCard(player, cardIndex) {
    const hand = player === OWNER.PLAYER_1 ? this.cards.player1 : this.cards.player2;
    const playedCard = hand[cardIndex];
    hand[cardIndex] = this.cards.neutral;
    this.cards.neutral = playedCard;
    this.refreshCardUI();
  }

  checkWayOfTheStone(capturedPiece, winner) {
    if (capturedPiece && capturedPiece.type === "MASTER") {
      this.gameState.endGame(winner);
      return true;
    }
    return false;
  }

  checkWayOfTheStream(movedPiece, winner) {
    if (movedPiece.type !== "MASTER") {
      return false;
    }

    const reachedTemple =
      (winner === OWNER.PLAYER_1 && movedPiece.col === 2 && movedPiece.row === 0) ||
      (winner === OWNER.PLAYER_2 && movedPiece.col === 2 && movedPiece.row === 4);

    if (reachedTemple) {
      this.gameState.endGame(winner);
      return true;
    }
    return false;
  }

  getAIMove() {
    const moves = [];
    const hand = this.currentPlayer === OWNER.PLAYER_1 ? this.cards.player1 : this.cards.player2;

    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const cell = this.board[row][col];
        if (!cell || cell.owner !== this.currentPlayer) {
          continue;
        }

        hand.forEach((card, cardIndex) => {
          this.getValidMoves(cell.piece, card, this.currentPlayer).forEach((move) => {
            moves.push({
              piece: cell.piece,
              cardIndex,
              destination: move,
            });
          });
        });
      }
    }

    if (moves.length === 0) {
      return null;
    }
    return Phaser.Utils.Array.GetRandom(moves);
  }

  scheduleAITurn() {
    this.time.delayedCall(500, () => {
      if (this.currentPlayer !== this.aiPlayer || this.gameState.phase !== PHASE.PLAYER_2_TURN) {
        return;
      }

      const move = this.getAIMove();
      if (!move) {
        this.gameState.endGame(OWNER.PLAYER_1);
        return;
      }

      this.selectedPiece = move.piece;
      this.selectedCardIndex = move.cardIndex;
      this.validMovesForSelection = [
        { ...move.destination, cardIndexes: [move.cardIndex] },
      ];
      this.executeMove(move.destination.col, move.destination.row);
    });
  }
}
