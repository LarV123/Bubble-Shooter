import * as Phaser from "phaser";

export default class Pointer extends Phaser.GameObjects.Image{
  
  constructor(scene : Phaser.Scene, x : number, y : number){
    super(scene, x, y, "arrow");
    scene.add.existing(this);
  }

  getAimAngle() : number{
    return this.rotation-Math.PI/2;
  }

}