import { TEXTURE_ASSETS } from "../data/textureKeys.js";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // 1x1 white pixel used as the base texture for tinted pixel-art UI blocks.
    this.load.image(
      "pixel",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO6QxM8AAAAASUVORK5CYII=",
    );

    TEXTURE_ASSETS.forEach((asset) => {
      this.load.image(asset.key, asset.path);
    });
  }

  create() {
    this.scene.start("GameScene", { aiEnabled: true });
  }
}
