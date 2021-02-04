import * as Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload(): void {
    this.load.setPath("src/Assets");
    this.load.spritesheet("bubble", "Sprite/bubblesprite.png", {frameWidth:120, frameHeight:120, margin:30, spacing:60});
    this.load.image("arrow", "Sprite/arrow.png");
    this.load.image("replay", "Sprite/Replay.png");
    this.load.audio("bubble_pop", "Audio/Blop.mp3");
    this.load.audio("bubble_shoot", "Audio/Button.wav");
    this.load.audio("bubble_bounce", "Audio/Bounce.wav");
  }

  create(): void {
    this.anims.create({key:"bubble_pop", frames:this.anims.generateFrameNumbers("bubble", {start : 1, end : 5}), frameRate : 30, repeat : 0});
    this.scene.start("GameScene");
  }
}
