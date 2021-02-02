import * as Phaser from "phaser";
import ColorControl from "../Control/ColorControl";

export default class HUD extends Phaser.GameObjects.GameObject{

  private height : number = 150;

  private colorControl : ColorControl;

  private nextBallUI : Phaser.GameObjects.Image;

  constructor(scene : Phaser.Scene, colorControl : ColorControl){
    super(scene, "HUD");
    this.colorControl = colorControl;
    this.scene.add.rectangle(scene.cameras.main.centerX, scene.cameras.main.height - this.height/2, scene.cameras.main.width, this.height, 0xa5a5a5);
    this.nextBallUI = this.scene.add.image(scene.cameras.main.centerX + 100, scene.cameras.main.height - this.height/2 - 30, "bubble");
    this.nextBallUI.setScale(0.5);
    this.nextBallUI.setTint(this.colorControl.getNextColor());
  }

  update() : void{
    this.nextBallUI.setTint(this.colorControl.getNextColor());
  }

  destroy() : void{
    super.destroy();
  }

}