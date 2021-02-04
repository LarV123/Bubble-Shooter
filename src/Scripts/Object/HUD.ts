import * as Phaser from "phaser";
import ColorControl from "../Control/ColorControl";
import DashedLine from "./DashedLine";
import ProgressBox from "./ProgressBox";

export default class HUD extends Phaser.GameObjects.GameObject{

  private height : number = 150;

  private colorControl : ColorControl;

  private nextBallUI : Phaser.GameObjects.Image;
  private scoreUI : Phaser.GameObjects.Text;

  private nextBallText : Phaser.GameObjects.Text;

  private progressBox : ProgressBox;

  private gameOverLimit : DashedLine;

  constructor(scene : Phaser.Scene, colorControl : ColorControl){
    super(scene, "HUD");
    this.colorControl = colorControl;
    this.scene.add.rectangle(scene.cameras.main.centerX, scene.cameras.main.height - this.height/2, scene.cameras.main.width, this.height, 0xa5a5a5);
    this.nextBallUI = this.scene.add.image(scene.cameras.main.centerX + 300, scene.cameras.main.height - this.height/2, "bubble");
    this.nextBallUI.setScale(0.5);
    this.nextBallUI.setTint(this.colorControl.getNextColor());

    this.scoreUI = this.scene.add.text(20, this.scene.cameras.main.height-100, "Score : 0", {fontSize:"36px", fontFamily:"Arial", color:"#000000"});
    this.nextBallText = this.scene.add.text(456, this.scene.cameras.main.height-100, "Next Ball", {fontSize:"36px", fontFamily:"Arial", color:"#000000"});

    this.progressBox = new ProgressBox(scene, scene.cameras.main.centerX, scene.cameras.main.height-this.height+10, scene.cameras.main.width, 20, 0xffffff, 0x000000);
    this.gameOverLimit = new DashedLine(scene, 0, scene.cameras.main.height-380, scene.cameras.main.width, scene.cameras.main.height-380, 0xffffff, 10, 10, 10);
  }

  setScore(score : number){
    this.scoreUI.setText("Score : "+score);
  }

  setProgress(progress : number){
    this.progressBox.setProgress(progress);
  }


  update() : void{
    this.nextBallUI.setTint(this.colorControl.getNextColor());
    this.progressBox.update();
    this.gameOverLimit.draw();
  }

  destroy() : void{
    this.nextBallUI.destroy();
    this.scoreUI.destroy();
    this.nextBallText.destroy();
    super.destroy();
  }

}