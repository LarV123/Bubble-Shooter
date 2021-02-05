import * as Phaser from "phaser";
import GameScreen from "../GameScreen";

export const BUBBLE_RADIUS = 45;

export default class Bubble extends Phaser.Physics.Arcade.Sprite{

  private color : number;

  constructor(scene : Phaser.Scene, x : number, y : number, color : number){
    super(scene, x, y, "bubble");

    scene.add.existing(this);

    this.setTint(color);
    this.color = color;
    this.setScale(GameScreen.getInstance().resize(BUBBLE_RADIUS) * 2/ this.width);

  }

  playPopAnimation() : void{
    this.anims.play("pop");
  }

  getColor() : number{
    return this.color;
  }

}