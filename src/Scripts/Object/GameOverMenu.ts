import * as Phaser from "phaser";
import GameOverHandler from "../Control/GameOverHandler";
import Activable from "../Interfaces/Activable";
import ImageButton from "./ImageButton";

export default class GameOverMenu extends Phaser.GameObjects.GameObject implements Activable{

  private graphics : Phaser.GameObjects.Graphics;

  private replayButton : ImageButton;
  private gameOverText : Phaser.GameObjects.Text;
  private gameOverHandler : GameOverHandler;

  constructor(scene : Phaser.Scene, gameOverHandler : GameOverHandler){
    super(scene, "Game Over Menu");
    this.gameOverHandler = gameOverHandler;
    this.graphics = scene.add.graphics();
    this.replayButton = new ImageButton(scene, scene.cameras.main.centerX, scene.cameras.main.centerY, "replay");
    this.replayButton.setVisible(false);
    this.replayButton.setScale(0.8);
    this.replayButton.depth = 101;
    this.replayButton.on("click", ()=>{this.gameOverHandler.restart()}, this);
    this.active = false;

    this.gameOverText = this.scene.add.text(scene.cameras.main.centerX, scene.cameras.main.centerY - 200, "GAME OVER", {fontSize:"72px", fontFamily:"Arial", color:"#ffffff"}).setOrigin(0.5);
    this.gameOverText.setVisible(false);

    this.gameOverText.depth = 101;
    this.graphics.depth = 100;
  }

  SetActive(value: boolean): void {
    this.active = value;
  }

  IsActive(): boolean {
    return this.active;
  }

  update() : void{
    this.replayButton.setVisible(this.active);
    this.gameOverText.setVisible(this.active);
    this.graphics.clear();
    if(this.active){
      this.graphics.fillStyle(0x000000, 0.7);
      this.graphics.fillRect(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height);
    }
  }

  destroy() : void{
    this.graphics.destroy();
    super.destroy();
  }

}