import * as Phaser from "phaser";

export default class StaticBubble extends Phaser.Physics.Arcade.Sprite{

  private color : number;

  constructor(scene : Phaser.Scene, x : number, y : number, color? : number){
    super(scene, x, y, "bubble");

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.color = color;
    this.setTint(color);

    this.setScale(0.75);
    this.refreshBody();
    let resize : number = 20;
    this.setCircle(this.displayWidth/2 - resize/2);
    this.setOffset(resize/2);
    this.setPushable(false);

  }

  getColor() : number {
    return this.color;
  }

}