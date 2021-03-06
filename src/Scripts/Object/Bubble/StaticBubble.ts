import * as Phaser from "phaser";
import Bubble from "./Bubble";
import ScoreSystem from "../../Control/ScoreSystem";
import GameScreen from "../GameScreen";

export default class StaticBubble extends Bubble{

  private endAnim : Phaser.GameObjects.GameObject;

  constructor(scene : Phaser.Scene, x : number, y : number, color? : number){
    super(scene, x, y, color);

    scene.physics.add.existing(this);

    this.setCircle(40);
    this.body.setOffset(20, 20);
    this.on("animationcomplete", this.popAnimationComplete, this);
  }

  pop() : void{
    this.scene.sound.play("bubble_pop");
    ScoreSystem.getInstance().addScore(10);
    this.endAnim = this.scene.add.sprite(this.x, this.y, "bubble").setScale(this.scaleX).setTint(this.getColor()).play("bubble_pop").on("animationcomplete", this.popAnimationComplete, this);
    this.destroy();
  }

  fall() : void{
    ScoreSystem.getInstance().addScore(20);
    this.endAnim = this.scene.physics.add.sprite(this.x, this.y, "bubble").setScale(this.scaleX).setTint(this.getColor()).setGravityY(1000);
    this.scene.tweens.add({
      targets: this.endAnim,
      duration: 800,
      alpha: { getStart: () => 1, getEnd: () => 0},
      loop:-1
    });
    this.scene.time.addEvent({delay: 800, callback:this.popAnimationComplete, callbackScope:this});
    this.destroy();
  }

  popAnimationComplete() : void{
    this.endAnim.destroy();
  }

  getCircleShape() : Phaser.Geom.Circle{
    return new Phaser.Geom.Circle(this.x, this.y, this.displayWidth/2);
  }

}