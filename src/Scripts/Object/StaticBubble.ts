import * as Phaser from "phaser";

export default class StaticBubble extends Phaser.Physics.Arcade.Sprite{

  constructor(scene : Phaser.Scene, x : number, y : number){
    super(scene, x, y, "bubble");

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.setScale(0.75);
    this.body.setCircle(60);
    this.refreshBody();
    this.setPushable(false);

  }

}