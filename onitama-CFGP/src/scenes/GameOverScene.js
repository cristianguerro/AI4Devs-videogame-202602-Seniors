export class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    this.winner = data?.winner ?? "Unknown";
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x111111, 0.9);
    this.add
      .text(width / 2, height / 2 - 30, "Game Over", {
        fontSize: "20px",
        color: "#f5edd7",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2, `${this.winner} wins`, {
        fontSize: "14px",
        color: "#f7c46d",
      })
      .setOrigin(0.5);

    const button = this.add
      .rectangle(width / 2, height / 2 + 38, 108, 26, 0x7d2f2f)
      .setStrokeStyle(2, 0xd9b36f)
      .setInteractive({ useHandCursor: true });

    this.add
      .text(button.x, button.y, "Play Again", {
        fontSize: "12px",
        color: "#fff7e6",
      })
      .setOrigin(0.5);

    button.on("pointerdown", () => {
      this.scene.stop("GameOverScene");
      this.scene.start("GameScene", { aiEnabled: true });
    });
  }
}
