import * as Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload(): void {
    this.load.setPath("src/Assets");
    this.load.spritesheet("bubble", "Sprite/bubblesprite.png", {frameWidth:120, frameHeight:120, margin:30, spacing:60});
    this.load.image("arrow", "Sprite/arrow.png");
  }

  create(): void {
    this.scene.start("GameScene");
  }
}
