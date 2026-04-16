import { BootScene } from "./scenes/BootScene.js";
import { GameScene } from "./scenes/GameScene.js";
import { GameOverScene } from "./scenes/GameOverScene.js";

const config = {
  type: Phaser.AUTO,
  parent: "game-root",
  backgroundColor: "#1a1715",
  pixelArt: true,
  width: 320,
  height: 180,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, GameScene, GameOverScene],
};

new Phaser.Game(config);
