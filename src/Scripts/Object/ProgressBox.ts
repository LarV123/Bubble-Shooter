import * as Phaser from "phaser";

export default class ProgressBox extends Phaser.GameObjects.Graphics{

  private progress : number;
  private width : number;
  private height : number;

  private fillColor : number;
  private backgroundColor : number;

  constructor(scene : Phaser.Scene, x : number, y : number, width : number, height : number, fillColor : number, backgroundColor : number){
    super(scene);
    scene.add.existing(this);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
    this.backgroundColor = backgroundColor;
    this.setProgress(0.3);
  }

  setProgress(progress : number){
    this.progress = progress;
  }

  update() : void{
    this.clear();
    this.fillStyle(this.backgroundColor, 1.0);
    this.fillRect(- this.width/2, - this.height/2, this.width, this.height);
    
    this.fillStyle(this.fillColor, 1.0);
    this.fillRect(-this.width/2, -this.height/2, this.width * this.progress, this.height);
  }

}