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
const TURN_SELECTION_STATE = {
  IDLE: "IDLE",
  PREVIEWING_CARD: "PREVIEWING_CARD",
  CARD_SELECTED: "CARD_SELECTED",
  PIECE_SELECTED: "PIECE_SELECTED",
  RESOLVING_MOVE: "RESOLVING_MOVE",
};
const CARD_SLOT_METRICS = {
  player: { width: 52, height: 28, titleHeight: 13, bodyInset: 4 },
  neutral: { width: 48, height: 30, titleHeight: 14, bodyInset: 4 },
};
const CARD_SLOT_COLORS = {
  playerIdle: {
    shell: 0x221f1d,
    body: 0x2b2521,
    title: 0x5a4f42,
    text: "#f8edd3",
    frameAlpha: 0.84,
  },
  playerActive: {
    shell: 0x27231f,
    body: 0x332b25,
    title: 0x74624c,
    text: "#fff3d8",
    frameAlpha: 1,
  },
  playerPreview: {
    shell: 0x292520,
    body: 0x3b3128,
    title: 0x8f7a59,
    text: "#fff1d2",
    frameAlpha: 1,
  },
  playerReady: {
    shell: 0x29241f,
    body: 0x383028,
    title: 0x857057,
    text: "#fff1cf",
    frameAlpha: 1,
  },
  playerSelected: {
    shell: 0x31291f,
    body: 0x4a3a27,
    title: 0xa98a57,
    text: "#fff6db",
    frameAlpha: 1,
  },
  neutral: {
    shell: 0x242228,
    body: 0x2f2d35,
    title: 0x605b6d,
    text: "#f4edd8",
    frameAlpha: 1,
  },
};

const CARD_TITLE_OVERRIDES = {
  Elephant: "Ele\nphant",
  Rooster: "Roos\nter",
};

const TUTORIAL_STORAGE_KEY = "pixel-tama:tutorial-state";
const TUTORIAL_VERSION = "1";
const TUTORIAL_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  SKIPPED: "skipped",
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
    this.previewCardIndex = null;
    this.previewCardMode = null;
    this.selectedCardIndex = null;
    this.selectionState = TURN_SELECTION_STATE.IDLE;
    this.eligiblePiecesForSelection = [];
    this.validMovesForSelection = [];
    this.cardUi = { player1: [], player2: [], neutral: null };
    this.previewUi = null;
    this.instructionUi = null;
    this.tutorialStorageAvailable = true;
    this.tutorialFallbackState = null;
    this.tutorialState = this.loadTutorialState();
    this.isTutorialPromptVisible = false;
    this.isTutorialTourActive = false;
    this.isInstructionPanelOpen = false;

    this.cards = dealCards();
    this.currentPlayer = OWNER.PLAYER_1;

    this.gameState = {
      phase: PHASE.PLAYER_1_TURN,
      winner: null,
      startTurn: (player) => {
        this.currentPlayer = player;
        this.gameState.phase = phaseForPlayer(player);
        this.resetInteractionState();
        this.refreshMovementPreview();
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
    this.createMovementPreviewUI();
    this.createTurnIndicator();
    this.createInstructionUI();
    this.refreshCardUI();
    this.refreshMovementPreview();
    this.refreshTurnIndicator();
    this.showTutorialPromptIfNeeded();
    this.refreshInstructionUI();
  }

  getDefaultTutorialState() {
    return { version: TUTORIAL_VERSION, status: TUTORIAL_STATUS.PENDING };
  }

  normalizeTutorialState(rawValue) {
    const fallback = this.getDefaultTutorialState();
    if (!rawValue || typeof rawValue !== "object") {
      return fallback;
    }

    const status = rawValue.status;
    const version = typeof rawValue.version === "string" ? rawValue.version : "";
    const statusIsKnown = Object.values(TUTORIAL_STATUS).includes(status);

    if (!statusIsKnown || version !== TUTORIAL_VERSION) {
      return fallback;
    }

    return { version, status };
  }

  loadTutorialState() {
    const fallback = this.getDefaultTutorialState();

    try {
      const value = globalThis.localStorage?.getItem(TUTORIAL_STORAGE_KEY);
      if (!value) {
        return fallback;
      }
      return this.normalizeTutorialState(JSON.parse(value));
    } catch {
      this.tutorialStorageAvailable = false;
      this.tutorialFallbackState = fallback;
      return fallback;
    }
  }

  saveTutorialState(status) {
    const next = this.normalizeTutorialState({ version: TUTORIAL_VERSION, status });
    this.tutorialState = next;

    if (!this.tutorialStorageAvailable) {
      this.tutorialFallbackState = next;
      return;
    }

    try {
      globalThis.localStorage?.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(next));
    } catch {
      this.tutorialStorageAvailable = false;
      this.tutorialFallbackState = next;
    }
  }

  shouldShowTutorialPrompt() {
    return this.tutorialState.status === TUTORIAL_STATUS.PENDING;
  }

  isInstructionBlockingInput() {
    return this.isTutorialPromptVisible;
  }

  showTutorialPromptIfNeeded() {
    if (!this.shouldShowTutorialPrompt()) {
      return;
    }
    this.isTutorialPromptVisible = true;
    this.refreshInstructionUI();
  }

  openInstructionPanel(options = {}) {
    this.isInstructionPanelOpen = true;
    if (options.fromTutorial === true) {
      this.isTutorialTourActive = true;
    }
    this.refreshInstructionUI();
  }

  closeInstructionPanel(options = {}) {
    if (options.completeTutorial && this.isTutorialTourActive) {
      this.saveTutorialState(TUTORIAL_STATUS.COMPLETED);
    }
    this.isInstructionPanelOpen = false;
    this.isTutorialTourActive = false;
    this.refreshInstructionUI();
  }

  skipTutorialPrompt() {
    this.isTutorialPromptVisible = false;
    this.saveTutorialState(TUTORIAL_STATUS.SKIPPED);
    this.refreshInstructionUI();
  }

  startTutorialTour() {
    this.isTutorialPromptVisible = false;
    this.openInstructionPanel({ fromTutorial: true });
  }

  toggleInstructionPanel() {
    if (this.isInstructionPanelOpen) {
      this.closeInstructionPanel({ completeTutorial: false });
      return;
    }
    this.openInstructionPanel({ fromTutorial: false });
  }

  getGuidanceHintText() {
    switch (this.selectionState) {
      case TURN_SELECTION_STATE.PREVIEWING_CARD:
        return "Preview";
      case TURN_SELECTION_STATE.CARD_SELECTED:
        return "Pick\npiece";
      case TURN_SELECTION_STATE.PIECE_SELECTED:
        return "Pick\ntile";
      case TURN_SELECTION_STATE.RESOLVING_MOVE:
        return "Resol\nving";
      case TURN_SELECTION_STATE.IDLE:
      default:
        return "Pick\ncard";
    }
  }

  getGuidanceDetailText() {
    switch (this.selectionState) {
      case TURN_SELECTION_STATE.PREVIEWING_CARD:
        return "Hover or tap card\nagain to lock";
      case TURN_SELECTION_STATE.CARD_SELECTED:
        return "Select a glowing\npiece";
      case TURN_SELECTION_STATE.PIECE_SELECTED:
        return "Pick highlighted\ndestination";
      case TURN_SELECTION_STATE.RESOLVING_MOVE:
        return "Move resolving\n...";
      case TURN_SELECTION_STATE.IDLE:
      default:
        return "Choose a card\nto begin";
    }
  }

  createInstructionUI() {
    const helpButtonBg = this.add
      .rectangle(305, 10, 18, 12, 0x2f2b26)
      .setDepth(30)
      .setStrokeStyle(1, 0x8e7b5f)
      .setInteractive({ useHandCursor: true });
    const helpButtonLabel = this.add
      .text(305, 10, "?", {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: "9px",
        fontStyle: "bold",
        color: "#f8edd3",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(31);

    helpButtonBg.on("pointerdown", () => {
      if (this.gameState.phase === PHASE.GAME_OVER) {
        return;
      }
      this.toggleInstructionPanel();
    });

    const panelBg = this.add.rectangle(50, 90, 88, 108, 0x1f1a15, 0.96).setDepth(26).setStrokeStyle(1, 0x8e7b5f);
    const panelTitle = this.add
      .text(50, 44, "Help", {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: "8px",
        fontStyle: "bold",
        color: "#f7ecd2",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(27);
    const panelBody = this.add
      .text(50, 90, "", {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: "7px",
        color: "#e6d8bd",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(27);
    panelBody.setLineSpacing(-1);

    const panelCloseBg = this.add
      .rectangle(50, 130, 56, 12, 0x3a3127)
      .setDepth(27)
      .setStrokeStyle(1, 0x9f8866)
      .setInteractive({ useHandCursor: true });
    const panelCloseLabel = this.add
      .text(50, 130, "Close", {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: "7px",
        fontStyle: "bold",
        color: "#fff2d5",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(28);
    panelCloseBg.on("pointerdown", () => {
      this.closeInstructionPanel({ completeTutorial: true });
    });

    const promptBg = this.add.rectangle(50, 23, 92, 34, 0x201c17, 0.98).setDepth(32).setStrokeStyle(1, 0xa08765);
    const promptText = this.add
      .text(50, 10, "First game?\nQuick tour", {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: "7px",
        color: "#f4e8cf",
        align: "center",
      })
      .setOrigin(0.5, 0)
      .setDepth(33);
    promptText.setLineSpacing(0);

    const promptStartBg = this.add
      .rectangle(30, 35, 30, 10, 0x3a3228)
      .setDepth(33)
      .setStrokeStyle(1, 0xb39872)
      .setInteractive({ useHandCursor: true });
    const promptStartLabel = this.add
      .text(30, 35, "Start", {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: "6px",
        fontStyle: "bold",
        color: "#fff3d8",
      })
      .setOrigin(0.5)
      .setDepth(34);
    promptStartBg.on("pointerdown", () => {
      this.startTutorialTour();
    });

    const promptSkipBg = this.add
      .rectangle(70, 35, 30, 10, 0x312b25)
      .setDepth(33)
      .setStrokeStyle(1, 0x7d6e58)
      .setInteractive({ useHandCursor: true });
    const promptSkipLabel = this.add
      .text(70, 35, "Skip", {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: "6px",
        fontStyle: "bold",
        color: "#e6d6ba",
      })
      .setOrigin(0.5)
      .setDepth(34);
    promptSkipBg.on("pointerdown", () => {
      this.skipTutorialPrompt();
    });

    this.instructionUi = {
      helpButtonBg,
      helpButtonLabel,
      panelElements: [panelBg, panelTitle, panelBody, panelCloseBg, panelCloseLabel],
      panelBody,
      panelCloseLabel,
      promptElements: [promptBg, promptText, promptStartBg, promptStartLabel, promptSkipBg, promptSkipLabel],
    };

    this.refreshInstructionUI();
  }

  refreshInstructionUI() {
    if (!this.instructionUi) {
      return;
    }

    const activeTurn = this.gameState.phase === PHASE.PLAYER_1_TURN || this.gameState.phase === PHASE.PLAYER_2_TURN;
    this.instructionUi.helpButtonBg.setVisible(activeTurn);
    this.instructionUi.helpButtonLabel.setVisible(activeTurn);

    const showPanel = this.isInstructionPanelOpen && this.gameState.phase !== PHASE.GAME_OVER;
    this.instructionUi.panelElements.forEach((node) => {
      node.setVisible(showPanel);
    });

    if (showPanel) {
      const hint = this.getGuidanceHintText().replace("\n", " ");
      this.instructionUi.panelBody.setText(
        `Now: ${hint}\n${this.getGuidanceDetailText()}\n\nFlow:\ncard -> piece -> tile`,
      );
      this.instructionUi.panelCloseLabel.setText(this.isTutorialTourActive ? "Done" : "Close");
    }

    const showPrompt = this.isTutorialPromptVisible && activeTurn;
    this.instructionUi.promptElements.forEach((node) => {
      node.setVisible(showPrompt);
    });
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

  getActiveCard() {
    if (this.selectedCardIndex === null) {
      return null;
    }
    return this.activePlayerCards()[this.selectedCardIndex] ?? null;
  }

  getDisplayedPreviewCard() {
    const index = this.selectedCardIndex ?? this.previewCardIndex;
    if (index === null) {
      return null;
    }

    const card = this.activePlayerCards()[index];
    if (!card) {
      return null;
    }

    return { card, index };
  }

  syncSelectionState() {
    if (this.gameState?.phase === PHASE.TRANSITIONING_CARD) {
      this.selectionState = TURN_SELECTION_STATE.RESOLVING_MOVE;
      return;
    }

    if (this.selectedCardIndex !== null && this.selectedPiece) {
      this.selectionState = TURN_SELECTION_STATE.PIECE_SELECTED;
      return;
    }

    if (this.selectedCardIndex !== null) {
      this.selectionState = TURN_SELECTION_STATE.CARD_SELECTED;
      return;
    }

    if (this.previewCardIndex !== null) {
      this.selectionState = TURN_SELECTION_STATE.PREVIEWING_CARD;
      this.refreshInstructionUI();
      return;
    }

    this.selectionState = TURN_SELECTION_STATE.IDLE;
    this.refreshInstructionUI();
  }

  resetInteractionState() {
    this.stopSelectedPiecePulse();
    this.selectedPiece = null;
    this.previewCardIndex = null;
    this.previewCardMode = null;
    this.selectedCardIndex = null;
    this.eligiblePiecesForSelection = [];
    this.validMovesForSelection = [];
    this.clearHighlights();
    this.syncSelectionState();
  }

  isTouchPointer(pointer) {
    return pointer?.wasTouch || pointer?.event?.pointerType === "touch";
  }

  setPreviewCard(index, mode = "hover") {
    if (this.selectedCardIndex !== null) {
      return;
    }
    this.previewCardIndex = index;
    this.previewCardMode = mode;
    this.syncSelectionState();
    this.refreshCardUI();
    this.refreshMovementPreview();
  }

  clearPreviewCard() {
    if (this.selectedCardIndex !== null) {
      return;
    }
    this.previewCardIndex = null;
    this.previewCardMode = null;
    this.syncSelectionState();
    this.refreshCardUI();
    this.refreshMovementPreview();
  }

  getEligiblePiecesForCard(card) {
    const pieces = [];
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const cell = this.board[row][col];
        if (!cell || cell.owner !== this.currentPlayer) {
          continue;
        }

        if (this.getValidMoves(cell.piece, card, this.currentPlayer).length > 0) {
          pieces.push(cell.piece);
        }
      }
    }
    return pieces;
  }

  refreshBoardGuidance() {
    this.stopSelectedPiecePulse();
    this.validMovesForSelection = [];
    this.eligiblePiecesForSelection = [];

    const activeCard = this.getActiveCard();
    if (!activeCard) {
      this.selectedPiece = null;
      this.clearHighlights();
      this.syncSelectionState();
      return;
    }

    this.eligiblePiecesForSelection = this.getEligiblePiecesForCard(activeCard);

    if (this.selectedPiece && this.eligiblePiecesForSelection.includes(this.selectedPiece)) {
      this.validMovesForSelection = this.getValidMoves(this.selectedPiece, activeCard, this.currentPlayer).map(
        (move) => ({
          ...move,
          cardIndexes: [this.selectedCardIndex],
        }),
      );
      this.startSelectedPiecePulse();
    } else {
      this.selectedPiece = null;
    }

    this.renderHighlights();
    this.syncSelectionState();
  }

  setActiveCard(index) {
    const card = this.activePlayerCards()[index];
    if (!card) {
      return;
    }

    this.selectedCardIndex = index;
    this.previewCardIndex = index;
    this.previewCardMode = "active";
    this.refreshBoardGuidance();
    this.refreshCardUI();
    this.refreshMovementPreview();
  }

  clearPieceSelection() {
    this.stopSelectedPiecePulse();
    this.selectedPiece = null;
    this.validMovesForSelection = [];
    this.refreshBoardGuidance();
    this.refreshCardUI();
    this.refreshMovementPreview();
  }

  selectPieceForActiveCard(piece) {
    this.selectedPiece = piece;
    this.refreshBoardGuidance();
    this.refreshCardUI();
    this.refreshMovementPreview();
  }

  handleTileClick(col, row) {
    if (this.isInstructionBlockingInput()) {
      return;
    }

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

    if (this.selectedCardIndex !== null) {
      if (clickedCell && clickedCell.owner === this.currentPlayer) {
        if (this.eligiblePiecesForSelection.includes(clickedCell.piece)) {
          this.selectPieceForActiveCard(clickedCell.piece);
          return;
        }

        this.clearPieceSelection();
        return;
      }

      this.clearSelection();
      return;
    }

    this.clearSelection();
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
    } else if (this.selectedCardIndex !== null) {
      for (const piece of this.eligiblePiecesForSelection) {
        const eligibleMarker = this.createMarkerSprite(
          piece.col,
          piece.row,
          TEXTURE_KEYS.markers.validMove,
          TILE_SIZE - 10,
          3,
          0.6,
        );
        this.highlightSprites.push(eligibleMarker);
      }
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
    this.resetInteractionState();
    this.refreshCardUI();
    this.refreshMovementPreview();
  }

  getCardTitleLayout(name) {
    const text = name ?? "-";

    if (text === "-") {
      return { text, fontSize: "8px", lineSpacing: 0 };
    }

    if (CARD_TITLE_OVERRIDES[text]) {
      return { text: CARD_TITLE_OVERRIDES[text], fontSize: "6px", lineSpacing: -2 };
    }

    if (text.length <= 5) {
      return { text, fontSize: "9px", lineSpacing: 0 };
    }

    if (text.length <= 7) {
      return { text, fontSize: "8px", lineSpacing: 0 };
    }

    return {
      text: this.splitCardTitle(text),
      fontSize: "6px",
      lineSpacing: -2,
    };
  }

  splitCardTitle(name) {
    const minBreak = 3;
    const maxBreak = name.length - 3;
    const target = Math.floor(name.length / 2);
    let bestIndex = target;
    let bestScore = Number.POSITIVE_INFINITY;

    for (let index = minBreak; index <= maxBreak; index += 1) {
      const prev = name[index - 1].toLowerCase();
      const next = name[index].toLowerCase();
      const prevIsVowel = /[aeiou]/.test(prev);
      const nextIsVowel = /[aeiou]/.test(next);
      const boundaryBonus = prevIsVowel && !nextIsVowel ? -1.5 : prevIsVowel !== nextIsVowel ? -0.5 : 0;
      const score = Math.abs(index - target) + boundaryBonus;

      if (score < bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    }

    return `${name.slice(0, bestIndex)}\n${name.slice(bestIndex)}`;
  }

  applyCardTitleLayout(label, name) {
    const layout = this.getCardTitleLayout(name);
    label.setText(layout.text);
    label.setFontSize(layout.fontSize);
    label.setLineSpacing(layout.lineSpacing);
  }

  setCardSlotVisualState(slot, palette) {
    slot.bg.setFillStyle(palette.shell);
    slot.bodyPanel.setFillStyle(palette.body);
    slot.titleBand.setFillStyle(palette.title);
    slot.frame.setAlpha(palette.frameAlpha);
    slot.label.setColor(palette.text);
  }

  createCardUI() {
    const boardCenterX = this.boardStartX + (BOARD_SIZE * TILE_SIZE) / 2;
    const playerCardOffset = 30;
    const neutralOffset = 82;

    const createCardSlot = (x, y, owner, index, slotType = "player") => {
      const metrics = CARD_SLOT_METRICS[slotType];
      const titleY = y - metrics.height / 2 + metrics.titleHeight / 2 + 2;
      const bodyHeight = metrics.height - metrics.titleHeight - 5;
      const bodyY = y + metrics.height / 2 - bodyHeight / 2 - 2;
      const bg = this.add
        .rectangle(x, y, metrics.width, metrics.height, 0x221f1d)
        .setStrokeStyle(0, 0x000000)
        .setInteractive({ useHandCursor: true });
      const bodyPanel = this.add.rectangle(x, bodyY, metrics.width - metrics.bodyInset * 2, bodyHeight, 0x2b2521);
      const titleBand = this.add.rectangle(
        x,
        titleY,
        metrics.width - metrics.bodyInset * 2,
        metrics.titleHeight,
        0x5a4f42,
      );
      const frame = this.add
        .image(x, y, this.textureOrFallback(TEXTURE_KEYS.ui.cardFramePlayer))
        .setDisplaySize(metrics.width, metrics.height)
        .setDepth(8);
      const selectedFrame = this.add
        .image(x, y, this.textureOrFallback(TEXTURE_KEYS.ui.cardFrameSelected))
        .setDisplaySize(metrics.width, metrics.height)
        .setDepth(9)
        .setVisible(false);
      const label = this.add
        .text(x, titleY, "", {
          fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
          fontSize: "8px",
          fontStyle: "bold",
          color: "#f8edd3",
          align: "center",
        })
        .setOrigin(0.5)
        .setDepth(10);
      label.setLineSpacing(-1);

      bg.on("pointerover", () => {
        if (this.isInstructionBlockingInput()) {
          return;
        }

        if (owner !== this.currentPlayer || this.selectedCardIndex !== null) {
          return;
        }
        this.setPreviewCard(index, "hover");
      });

      bg.on("pointerout", () => {
        if (this.isInstructionBlockingInput()) {
          return;
        }

        if (owner !== this.currentPlayer || this.selectedCardIndex !== null) {
          return;
        }
        if (this.previewCardIndex === index && this.previewCardMode === "hover") {
          this.clearPreviewCard();
        }
      });

      bg.on("pointerdown", (pointer) => {
        if (this.isInstructionBlockingInput()) {
          return;
        }

        if (owner !== this.currentPlayer) {
          return;
        }

        if (this.selectedCardIndex === index) {
          this.clearSelection();
          return;
        }

        if (this.selectedCardIndex !== null) {
          this.setActiveCard(index);
          return;
        }

        if (this.previewCardIndex === index) {
          this.setActiveCard(index);
          return;
        }

        this.setPreviewCard(index, this.isTouchPointer(pointer) ? "tap" : "hover");
      });

      return { bg, bodyPanel, titleBand, frame, selectedFrame, label, owner, index, slotType };
    };

    this.cardUi.player2.push(createCardSlot(boardCenterX - playerCardOffset, 18, OWNER.PLAYER_2, 0));
    this.cardUi.player2.push(createCardSlot(boardCenterX + playerCardOffset, 18, OWNER.PLAYER_2, 1));
    this.cardUi.player1.push(createCardSlot(boardCenterX - playerCardOffset, 162, OWNER.PLAYER_1, 0));
    this.cardUi.player1.push(createCardSlot(boardCenterX + playerCardOffset, 162, OWNER.PLAYER_1, 1));

    const neutralX = boardCenterX + neutralOffset;
    const neutralSlot = createCardSlot(neutralX, 90, null, null, "neutral");
    neutralSlot.frame.setTexture(this.textureOrFallback(TEXTURE_KEYS.ui.cardFrameNeutral));
    this.cardUi.neutral = neutralSlot;
  }

  createMovementPreviewUI() {
    const panelX = 50;
    const panelY = 90;
    const panelWidth = 88;
    const panelHeight = 108;
    const cellSize = 8;
    const cellGap = 2;
    const gridSpan = cellSize * 5 + cellGap * 4;
    const gridOriginX = panelX - gridSpan / 2 + cellSize / 2;
    const gridOriginY = panelY + 4 - gridSpan / 2 + cellSize / 2;

    const panel = this.add
      .rectangle(panelX, panelY, panelWidth, panelHeight, 0x19171a)
      .setDepth(7)
      .setStrokeStyle(1, 0x675a48);
    const title = this.add
      .text(panelX, panelY - 36, "Move", {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: "8px",
        fontStyle: "bold",
        color: "#f7ecd2",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(8);
    title.setLineSpacing(-1);

    const hint = this.add
      .text(panelX, panelY + 36, "Pick\ncard", {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: "8px",
        color: "#cbbda0",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(8);
    hint.setLineSpacing(-1);

    const cells = [];
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 5; col += 1) {
        const cell = this.add
          .rectangle(
            gridOriginX + col * (cellSize + cellGap),
            gridOriginY + row * (cellSize + cellGap),
            cellSize,
            cellSize,
            0x34313a,
            0.55,
          )
          .setDepth(8);
        cells.push(cell);
      }
    }

    this.previewUi = { panel, title, hint, cells };
  }

  refreshMovementPreview() {
    if (!this.previewUi) {
      return;
    }

    const preview = this.getDisplayedPreviewCard();
    const card = preview?.card ?? null;
    const sign = this.currentPlayer === OWNER.PLAYER_1 ? 1 : -1;
    const moveColor = card?.stamp === "red" ? 0xd97f63 : 0x6ba8cb;
    const centerIndex = 12;

    this.previewUi.cells.forEach((cell, index) => {
      cell.setFillStyle(0x34313a, 0.45);
      cell.setStrokeStyle(0, 0x000000, 0);
      if (index === centerIndex) {
        cell.setFillStyle(0xf5e6c3, card ? 1 : 0.8);
      }
    });

    if (!card) {
      this.previewUi.title.setText("Move");
      this.previewUi.hint.setText(this.getGuidanceHintText());
      this.previewUi.panel.setAlpha(0.82);
      this.refreshInstructionUI();
      return;
    }

    const previewTitle = card.name.length > 7 ? this.splitCardTitle(card.name) : card.name;
    this.previewUi.title.setText(previewTitle);
    this.previewUi.hint.setText(this.getGuidanceHintText());
    this.previewUi.panel.setAlpha(this.selectedCardIndex !== null ? 1 : 0.92);

    card.moves.forEach((step) => {
      const col = 2 + step.dx * sign;
      const row = 2 + step.dy * sign;
      if (!inBounds(col, row)) {
        return;
      }
      const index = row * 5 + col;
      const cell = this.previewUi.cells[index];
      cell.setFillStyle(moveColor, 1);
      cell.setStrokeStyle(1, 0xf8edd3, 0.45);
    });

    this.refreshInstructionUI();
  }

  refreshCardUI() {
    const updateSlots = (slots, cards, isCurrentPlayer) => {
      slots.forEach((slot, index) => {
        const card = cards[index];
        this.applyCardTitleLayout(slot.label, card ? card.name : "-");
        slot.selectedFrame.setVisible(false);

        let palette = isCurrentPlayer ? CARD_SLOT_COLORS.playerActive : CARD_SLOT_COLORS.playerIdle;

        if (isCurrentPlayer && this.previewCardIndex === index && this.selectedCardIndex === null) {
          palette = CARD_SLOT_COLORS.playerPreview;
        }

        if (isCurrentPlayer && this.selectedCardIndex !== null) {
          palette = CARD_SLOT_COLORS.playerReady;
        }

        if (isCurrentPlayer && this.selectedCardIndex === index) {
          palette = CARD_SLOT_COLORS.playerSelected;
          slot.selectedFrame.setVisible(true);
        }

        this.setCardSlotVisualState(slot, palette);
      });
    };

    updateSlots(this.cardUi.player1, this.cards.player1, this.currentPlayer === OWNER.PLAYER_1);
    updateSlots(this.cardUi.player2, this.cards.player2, this.currentPlayer === OWNER.PLAYER_2);

    this.applyCardTitleLayout(this.cardUi.neutral.label, this.cards.neutral.name);
    this.setCardSlotVisualState(this.cardUi.neutral, CARD_SLOT_COLORS.neutral);
    this.cardUi.neutral.selectedFrame.setVisible(false);
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
    this.refreshInstructionUI();
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
    this.selectionState = TURN_SELECTION_STATE.RESOLVING_MOVE;
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
      targets: [slot.bg, slot.bodyPanel, slot.titleBand, slot.frame, slot.selectedFrame, slot.label],
      y: `+=${verticalOffset}`,
      duration: 80,
      yoyo: true,
      ease: "Sine.InOut",
    });
    this.tweens.add({
      targets: [neutral.bg, neutral.bodyPanel, neutral.titleBand, neutral.frame, neutral.label],
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

      this.setActiveCard(move.cardIndex);
      this.selectPieceForActiveCard(move.piece);
      this.executeMove(move.destination.col, move.destination.row);
    });
  }
}
