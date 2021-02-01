import * as Phaser from "phaser";
import Bubble from "./Bubble";

export default class StaticBubble extends Bubble{

  constructor(scene : Phaser.Scene, x : number, y : number, color? : number){
    super(scene, x, y, color);

    scene.physics.add.existing(this, true);

    this.refreshBody();
    let resize : number = 20;
    this.setCircle(this.displayWidth/2 - resize/2);
    this.setOffset(resize/2);
    this.setPushable(false);
  }

}