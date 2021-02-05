import * as Phaser from "phaser";
import ColorControl from "../Control/ColorControl";
import DashedLine from "./DashedLine";
import ProgressBox from "./ProgressBox";
import * as Constant from "../Util/Constant";
import GameScreen from "./GameScreen";
import GameScene from "../Scene/GameScene";

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
    this.scene.add.rectangle(GameScreen.getInstance().getRelativePosX(Constant.DEFAULT_WIDTH/2), GameScreen.getInstance().getRelativePosY(Constant.DEFAULT_HEIGHT - this.height/2), GameScreen.getInstance().resizeX(Constant.DEFAULT_WIDTH), GameScreen.getInstance().resizeY(this.height), 0xa5a5a5);
    this.nextBallUI = this.scene.add.image(GameScreen.getInstance().getRelativePosX(Constant.DEFAULT_WIDTH/2 + 300), GameScreen.getInstance().getRelativePosY(Constant.DEFAULT_HEIGHT - this.height/2), "bubble");
    this.nextBallUI.displayWidth = GameScreen.getInstance().resize(60);
    this.nextBallUI.displayHeight = GameScreen.getInstance().resize(60);
    this.nextBallUI.setTint(this.colorControl.getNextColor());
    this.scoreUI = this.scene.add.text(GameScreen.getInstance().getRelativePosX(20), GameScreen.getInstance().getRelativePosY(Constant.DEFAULT_HEIGHT-100), "Score : 0", {fontSize:""+GameScreen.getInstance().resize(36)+"px", fontFamily:"Arial", color:"#000000"});
    this.nextBallText = this.scene.add.text(GameScreen.getInstance().getRelativePosX(456), GameScreen.getInstance().getRelativePosY(Constant.DEFAULT_HEIGHT-100), "Next Ball", {fontSize:""+GameScreen.getInstance().resize(36)+"px", fontFamily:"Arial", color:"#000000"});
    this.progressBox = new ProgressBox(scene, GameScreen.getInstance().getRelativePosX(Constant.DEFAULT_WIDTH/2), GameScreen.getInstance().getRelativePosY(Constant.DEFAULT_HEIGHT-this.height+10), GameScreen.getInstance().resizeX(Constant.DEFAULT_WIDTH), GameScreen.getInstance().resizeY(20), 0xffffff, 0x000000);
    this.gameOverLimit = new DashedLine(scene, GameScreen.getInstance().getRelativePosX(0), GameScreen.getInstance().getRelativePosY(Constant.DEFAULT_HEIGHT-380), GameScreen.getInstance().getRelativePosX(Constant.DEFAULT_WIDTH), GameScreen.getInstance().getRelativePosY(Constant.DEFAULT_HEIGHT-380), 0xffffff, GameScreen.getInstance().resize(10), GameScreen.getInstance().resize(10), GameScreen.getInstance().resize(10));
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