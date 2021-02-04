import * as Phaser from "phaser";
import Bubble from "./Bubble";

export default class DynamicBubble extends Bubble {

  private speed : number = 900;

  constructor(scene : Phaser.Scene, x : number, y : number, color? : number){
    super(scene, x, y, color);

    scene.physics.add.existing(this);

    this.body.setCircle(60);
    this.setPushable(false);

    (this.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;
    this.setCollideWorldBounds(true, 1, 1);
  }

  shoot(angle : number) : this{
    this.scene.sound.play("bubble_shoot");
    let direction : Phaser.Math.Vector2 = Phaser.Math.Vector2.ONE;
    direction.setAngle(angle);
    direction.normalize();

    this.setVelocity(direction.x * this.speed, direction.y * this.speed);
    return this;
  }
  
  pop() : void{
    this.scene.sound.play("bubble_shoot");
    this.destroy();
  }

  attach() : this{
    this.setVelocity(0,0);
    this.setCollideWorldBounds(false);
    (this.body as Phaser.Physics.Arcade.Body).onWorldBounds = false;
    return this;
  }

}