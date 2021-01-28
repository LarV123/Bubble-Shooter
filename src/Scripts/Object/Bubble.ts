import * as Phaser from "phaser";

export default class Bubble extends Phaser.Physics.Arcade.Sprite {

  private speed : number = 900;

    constructor(scene : Phaser.Scene, x : number, y : number){
      super(scene, x, y, "bubble");

      scene.add.existing(this);
      scene.physics.add.existing(this);

      this.setScale(0.75);
      
      this.setPushable(false);

      (this.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;
      this.setCollideWorldBounds(true, 1, 1);

      this.body.setCircle(60);
    }

    shoot(angle : number) : this{
      let direction : Phaser.Math.Vector2 = Phaser.Math.Vector2.ONE;
      direction.setAngle(angle);
      direction.normalize();

      this.setVelocity(direction.x * this.speed, direction.y * this.speed);
      return this;
    }

    attach() : this{
      this.setVelocity(0,0);
      this.setCollideWorldBounds(false);
      (this.body as Phaser.Physics.Arcade.Body).onWorldBounds = false;
      return this;
    }

}