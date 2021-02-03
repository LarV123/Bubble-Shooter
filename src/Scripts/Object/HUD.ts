import * as Phaser from "phaser";
import ColorControl from "../Control/ColorControl";

export default class HUD extends Phaser.GameObjects.GameObject{

  private height : number = 150;

  private colorControl : ColorControl;

  private nextBallUI : Phaser.GameObjects.Image;
  private scoreUI : Phaser.GameObjects.Text;

  private nextBallText : Phaser.GameObjects.Text;

  constructor(scene : Phaser.Scene, colorControl : ColorControl){
    super(scene, "HUD");
    this.colorControl = colorControl;
    this.scene.add.rectangle(scene.cameras.main.centerX, scene.cameras.main.height - this.height/2, scene.cameras.main.width, this.height, 0xa5a5a5);
    this.nextBallUI = this.scene.add.image(scene.cameras.main.centerX + 300, scene.cameras.main.height - this.height/2 - 30, "bubble");
    this.nextBallUI.setScale(0.5);
    this.nextBallUI.setTint(this.colorControl.getNextColor());

    this.scoreUI = this.scene.add.text(20, this.scene.cameras.main.height-130, "Score : 0", {fontSize:"36px", color:"#000000"});
    this.nextBallText = this.scene.add.text(400, this.scene.cameras.main.height-120, "Next Ball", {fontSize:"36px", color:"#000000"});
  }

  setScore(score : number){
    this.scoreUI.setText("Score : "+score);
  }

  update() : void{
    this.nextBallUI.setTint(this.colorControl.getNextColor());
  }

  destroy() : void{
    super.destroy();
  }

}