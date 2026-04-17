// Naming contract: <category>:<name> keeps keys unique and searchable.
export const TEXTURE_KEYS = {
  fallbackPixel: "pixel",
  board: {
    tileBase: "board:tile-base",
    tileTemple: "board:tile-temple",
  },
  pieces: {
    p1Student: "pieces:p1-student",
    p1Master: "pieces:p1-master",
    p2Student: "pieces:p2-student",
    p2Master: "pieces:p2-master",
  },
  markers: {
    selectedPiece: "markers:selected-piece",
    validMove: "markers:valid-move",
    captureMove: "markers:capture-move",
  },
  ui: {
    cardFramePlayer: "ui:card-frame-player",
    cardFrameNeutral: "ui:card-frame-neutral",
    cardFrameSelected: "ui:card-frame-selected",
    turnIdle: "ui:turn-idle",
    turnActiveP1: "ui:turn-active-p1",
    turnActiveP2: "ui:turn-active-p2",
  },
};

export const TEXTURE_ASSETS = [
  { key: TEXTURE_KEYS.board.tileBase, path: "assets/board/tile-base.svg" },
  { key: TEXTURE_KEYS.board.tileTemple, path: "assets/board/tile-temple.svg" },
  { key: TEXTURE_KEYS.pieces.p1Student, path: "assets/pieces/p1-student.svg" },
  { key: TEXTURE_KEYS.pieces.p1Master, path: "assets/pieces/p1-master.svg" },
  { key: TEXTURE_KEYS.pieces.p2Student, path: "assets/pieces/p2-student.svg" },
  { key: TEXTURE_KEYS.pieces.p2Master, path: "assets/pieces/p2-master.svg" },
  { key: TEXTURE_KEYS.markers.selectedPiece, path: "assets/markers/selected-piece.svg" },
  { key: TEXTURE_KEYS.markers.validMove, path: "assets/markers/valid-move.svg" },
  { key: TEXTURE_KEYS.markers.captureMove, path: "assets/markers/capture-move.svg" },
  { key: TEXTURE_KEYS.ui.cardFramePlayer, path: "assets/ui/card-frame-player.svg" },
  { key: TEXTURE_KEYS.ui.cardFrameNeutral, path: "assets/ui/card-frame-neutral.svg" },
  { key: TEXTURE_KEYS.ui.cardFrameSelected, path: "assets/ui/card-frame-selected.svg" },
  { key: TEXTURE_KEYS.ui.turnIdle, path: "assets/ui/turn-idle.svg" },
  { key: TEXTURE_KEYS.ui.turnActiveP1, path: "assets/ui/turn-active-p1.svg" },
  { key: TEXTURE_KEYS.ui.turnActiveP2, path: "assets/ui/turn-active-p2.svg" },
];

export function allTextureKeys() {
  return TEXTURE_ASSETS.map((entry) => entry.key);
}
