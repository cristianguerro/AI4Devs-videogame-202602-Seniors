import { dealCards } from "../data/cards.js";
import { TEXTURE_KEYS, allTextureKeys } from "../data/textureKeys.js";

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

    this.layoutCenterX = this.cameras.main.centerX;
    this.layoutCenterY = this.cameras.main.centerY;
    this.boardStartX = Math.round(this.layoutCenterX - (BOARD_SIZE * TILE_SIZE) / 2);
    this.boardStartY = Math.round(this.layoutCenterY - (BOARD_SIZE * TILE_SIZE) / 2);

    this.board = Array.from({ length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => null));
    this.tileSprites = Array.from({ length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => null));
    this.highlightSprites = [];
    this.selectedPiecePulseTween = null;

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
        this.stopSelectedPiecePulse();
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
        const nextPlayer = this.currentPlayer === OWNER.PLAYER_1 ? OWNER.PLAYER_2 : OWNER.PLAYER_1;
        this.gameState.startTurn(nextPlayer);
      },
      endGame: (winner) => {
        this.gameState.phase = PHASE.GAME_OVER;
        this.gameState.winner = winner;
        this.scene.start("GameOverScene", { winner: winner.replace("_", " ") });
      },
    };

    this.validateRequiredTextures();
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
        const textureKey = this.textureOrFallback(
          this.isTempleArch(col, row) ? TEXTURE_KEYS.board.tileTemple : TEXTURE_KEYS.board.tileBase,
        );

        const tile = this.add
          .image(x, y, textureKey)
          .setDisplaySize(TILE_SIZE - 2, TILE_SIZE - 2)
          .setTint(0xffffff)
          .setInteractive({ useHandCursor: true });

        tile.setData("col", col);
        tile.setData("row", row);
        tile.on("pointerdown", () => this.handleTileClick(col, row));

        this.tileSprites[row][col] = tile;
      }
    }
  }

  validateRequiredTextures() {
    const missing = allTextureKeys().filter((key) => !this.textures.exists(key));
    if (missing.length > 0) {
      console.warn(`[Pixel-Tama] Missing textures (${missing.length}). Falling back to pixel: ${missing.join(", ")}`);
    }
  }

  textureOrFallback(key) {
    if (this.textures.exists(key)) {
      return key;
    }
    console.warn(`[Pixel-Tama] Missing texture key \"${key}\", using fallback \"pixel\"`);
    return TEXTURE_KEYS.fallbackPixel;
  }

  isTempleArch(col, row) {
    return (col === 2 && row === 0) || (col === 2 && row === 4);
  }

  createPieceSprite(owner, type, col, row) {
    const x = this.boardStartX + col * TILE_SIZE + TILE_SIZE / 2;
    const y = this.boardStartY + row * TILE_SIZE + TILE_SIZE / 2;

    const key = this.textureOrFallback(
      owner === OWNER.PLAYER_1
        ? type === "MASTER"
          ? TEXTURE_KEYS.pieces.p1Master
          : TEXTURE_KEYS.pieces.p1Student
        : type === "MASTER"
          ? TEXTURE_KEYS.pieces.p2Master
          : TEXTURE_KEYS.pieces.p2Student,
    );

    const sprite = this.add
      .image(x, y, key)
      .setDisplaySize(type === "MASTER" ? 16 : 13, type === "MASTER" ? 16 : 13)
      .setDepth(5);

    sprite.setData("baseScale", 1);

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
    if (this.gameState.phase === PHASE.TRANSITIONING_CARD || this.gameState.phase === PHASE.GAME_OVER) {
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
    this.startSelectedPiecePulse();
  }

  filterMovesBySelectedCard() {
    this.clearHighlights();
    if (!this.selectedPiece || this.selectedCardIndex === null) {
      return;
    }

    const card = this.activePlayerCards()[this.selectedCardIndex];
    this.validMovesForSelection = this.getValidMoves(this.selectedPiece, card, this.currentPlayer).map((m) => ({
      ...m,
      cardIndexes: [this.selectedCardIndex],
    }));

    this.renderHighlights();
    this.startSelectedPiecePulse();
  }

  renderHighlights() {
    this.clearHighlights();

    if (this.selectedPiece) {
      const selectedMarker = this.createMarkerSprite(
        this.selectedPiece.col,
        this.selectedPiece.row,
        TEXTURE_KEYS.markers.selectedPiece,
        TILE_SIZE - 5,
        4,
        0.95,
      );
      this.highlightSprites.push(selectedMarker);
    }

    for (const move of this.validMovesForSelection) {
      const hasOpponent = this.board[move.row][move.col] && this.board[move.row][move.col].owner !== this.currentPlayer;
      const markerTexture = hasOpponent ? TEXTURE_KEYS.markers.captureMove : TEXTURE_KEYS.markers.validMove;
      const marker = this.createMarkerSprite(move.col, move.row, markerTexture, TILE_SIZE - 6, 3, 0.9);
      this.highlightSprites.push(marker);
    }
  }

  createMarkerSprite(col, row, textureKey, size, depth, alpha) {
    const x = this.boardStartX + col * TILE_SIZE + TILE_SIZE / 2;
    const y = this.boardStartY + row * TILE_SIZE + TILE_SIZE / 2;
    return this.add
      .image(x, y, this.textureOrFallback(textureKey))
      .setDisplaySize(size, size)
      .setDepth(depth)
      .setAlpha(alpha);
  }

  clearHighlights() {
    this.highlightSprites.forEach((s) => s.destroy());
    this.highlightSprites = [];
  }

  startSelectedPiecePulse() {
    this.stopSelectedPiecePulse();
    if (!this.selectedPiece?.sprite) {
      return;
    }
    const sprite = this.selectedPiece.sprite;
    const baseScale = sprite.getData("baseScale") ?? 1;
    sprite.setScale(baseScale);
    this.selectedPiecePulseTween = this.tweens.add({
      targets: sprite,
      scale: baseScale * 1.06,
      duration: 260,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });
  }

  stopSelectedPiecePulse() {
    if (this.selectedPiecePulseTween) {
      this.selectedPiecePulseTween.stop();
      this.selectedPiecePulseTween = null;
    }
    if (this.selectedPiece?.sprite) {
      const baseScale = this.selectedPiece.sprite.getData("baseScale") ?? 1;
      this.selectedPiece.sprite.setScale(baseScale);
    }
  }

  clearSelection() {
    this.stopSelectedPiecePulse();
    this.selectedPiece = null;
    this.selectedCardIndex = null;
    this.validMovesForSelection = [];
    this.clearHighlights();
    this.refreshCardUI();
  }

  createCardUI() {
    const boardCenterX = this.boardStartX + (BOARD_SIZE * TILE_SIZE) / 2;
    const playerCardOffset = 30;
    const neutralOffset = 82;

    const createCardSlot = (x, y, owner, index) => {
      const bg = this.add
        .rectangle(x, y, 52, 28, 0x2e2a28)
        .setStrokeStyle(0, 0x000000)
        .setInteractive({ useHandCursor: true });
      const frame = this.add
        .image(x, y, this.textureOrFallback(TEXTURE_KEYS.ui.cardFramePlayer))
        .setDisplaySize(52, 28)
        .setDepth(8);
      const selectedFrame = this.add
        .image(x, y, this.textureOrFallback(TEXTURE_KEYS.ui.cardFrameSelected))
        .setDisplaySize(52, 28)
        .setDepth(9)
        .setVisible(false);
      const label = this.add
        .text(x, y, "", { fontSize: "8px", color: "#f4ead5", align: "center" })
        .setOrigin(0.5)
        .setDepth(10);

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

      return { bg, frame, selectedFrame, label, owner, index };
    };

    this.cardUi.player2.push(createCardSlot(boardCenterX - playerCardOffset, 18, OWNER.PLAYER_2, 0));
    this.cardUi.player2.push(createCardSlot(boardCenterX + playerCardOffset, 18, OWNER.PLAYER_2, 1));
    this.cardUi.player1.push(createCardSlot(boardCenterX - playerCardOffset, 162, OWNER.PLAYER_1, 0));
    this.cardUi.player1.push(createCardSlot(boardCenterX + playerCardOffset, 162, OWNER.PLAYER_1, 1));

    const neutralX = boardCenterX + neutralOffset;
    const neutralBg = this.add.rectangle(neutralX, 90, 48, 30, 0x2d2c30).setStrokeStyle(0, 0x000000);
    const neutralFrame = this.add
      .image(neutralX, 90, this.textureOrFallback(TEXTURE_KEYS.ui.cardFrameNeutral))
      .setDisplaySize(48, 30)
      .setDepth(8);
    const neutralLabel = this.add
      .text(neutralX, 90, "", { fontSize: "8px", color: "#fff6dc", align: "center" })
      .setOrigin(0.5)
      .setDepth(10);
    this.cardUi.neutral = { bg: neutralBg, frame: neutralFrame, label: neutralLabel };
  }

  refreshCardUI() {
    const updateSlots = (slots, cards, isCurrentPlayer) => {
      slots.forEach((slot, index) => {
        const card = cards[index];
        slot.label.setText(card ? card.name : "-");
        slot.bg.setFillStyle(isCurrentPlayer ? 0x2f2a24 : 0x26221e);
        slot.frame.setAlpha(isCurrentPlayer ? 1 : 0.8);
        slot.selectedFrame.setVisible(false);

        if (isCurrentPlayer && this.selectedPiece) {
          slot.bg.setFillStyle(0x383027);
        }

        if (isCurrentPlayer && this.selectedCardIndex === index) {
          slot.bg.setFillStyle(0x58452f);
          slot.selectedFrame.setVisible(true);
        }
      });
    };

    updateSlots(this.cardUi.player1, this.cards.player1, this.currentPlayer === OWNER.PLAYER_1);
    updateSlots(this.cardUi.player2, this.cards.player2, this.currentPlayer === OWNER.PLAYER_2);

    this.cardUi.neutral.label.setText(this.cards.neutral.name);
  }

  createTurnIndicator() {
    const boardCenterX = this.boardStartX + (BOARD_SIZE * TILE_SIZE) / 2;
    const indicatorOffset = 132;
    const indicatorX = boardCenterX - indicatorOffset;

    this.turnP1 = this.add
      .image(indicatorX, 162, this.textureOrFallback(TEXTURE_KEYS.ui.turnIdle))
      .setDisplaySize(42, 24)
      .setDepth(8);
    this.turnP2 = this.add
      .image(indicatorX, 18, this.textureOrFallback(TEXTURE_KEYS.ui.turnIdle))
      .setDisplaySize(42, 24)
      .setDepth(8);

    this.add.text(indicatorX, 162, "P1", { fontSize: "10px", color: "#f7eacc" }).setOrigin(0.5).setDepth(10);
    this.add.text(indicatorX, 18, "P2", { fontSize: "10px", color: "#f7eacc" }).setOrigin(0.5).setDepth(10);
  }

  refreshTurnIndicator() {
    const p1Active = this.currentPlayer === OWNER.PLAYER_1;
    this.turnP1.setTexture(this.textureOrFallback(p1Active ? TEXTURE_KEYS.ui.turnActiveP1 : TEXTURE_KEYS.ui.turnIdle));
    this.turnP2.setTexture(this.textureOrFallback(!p1Active ? TEXTURE_KEYS.ui.turnActiveP2 : TEXTURE_KEYS.ui.turnIdle));
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
    const targetX = this.boardStartX + targetCol * TILE_SIZE + TILE_SIZE / 2;
    const targetY = this.boardStartY + targetRow * TILE_SIZE + TILE_SIZE / 2;

    this.tweens.add({
      targets: movingPiece.sprite,
      x: targetX,
      y: targetY,
      duration: 120,
      ease: "Sine.Out",
      onComplete: () => {
        const baseScale = movingPiece.sprite.getData("baseScale") ?? 1;
        this.tweens.add({
          targets: movingPiece.sprite,
          scale: baseScale * 1.12,
          duration: 70,
          yoyo: true,
          ease: "Quad.Out",
        });
      },
    });

    if (captured) {
      this.playCaptureFlash(targetX, targetY);
    }

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
    this.time.delayedCall(220, () => {
      this.gameState.endCardTransition();
    });
  }

  playCaptureFlash(x, y) {
    const flash = this.add
      .rectangle(x, y, TILE_SIZE - 2, TILE_SIZE - 2, 0xffc27c)
      .setDepth(6)
      .setAlpha(0.8);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 120,
      ease: "Sine.Out",
      onComplete: () => flash.destroy(),
    });
  }

  swapCard(player, cardIndex) {
    this.animateCardSwap(player, cardIndex);
    const hand = player === OWNER.PLAYER_1 ? this.cards.player1 : this.cards.player2;
    const playedCard = hand[cardIndex];
    hand[cardIndex] = this.cards.neutral;
    this.cards.neutral = playedCard;
    this.refreshCardUI();
  }

  animateCardSwap(player, cardIndex) {
    const handSlots = player === OWNER.PLAYER_1 ? this.cardUi.player1 : this.cardUi.player2;
    const slot = handSlots[cardIndex];
    const neutral = this.cardUi.neutral;
    if (!slot || !neutral) {
      return;
    }

    const verticalOffset = player === OWNER.PLAYER_1 ? -4 : 4;
    this.tweens.add({
      targets: [slot.bg, slot.frame, slot.selectedFrame, slot.label],
      y: `+=${verticalOffset}`,
      duration: 80,
      yoyo: true,
      ease: "Sine.InOut",
    });
    this.tweens.add({
      targets: [neutral.bg, neutral.frame, neutral.label],
      y: `+=${-verticalOffset}`,
      duration: 80,
      yoyo: true,
      ease: "Sine.InOut",
    });
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
      this.validMovesForSelection = [{ ...move.destination, cardIndexes: [move.cardIndex] }];
      this.executeMove(move.destination.col, move.destination.row);
    });
  }
}
