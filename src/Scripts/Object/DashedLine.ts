import * as Phaser from "phaser";

export default class DashedLine extends Phaser.GameObjects.Graphics{

  x1 : number = 0;
  y1 : number = 0;
  x2 : number = 0;
  y2 : number = 0;

  color : number = 0xffffff;

  gapSize : number = 1;

  lineSize : number = 1;
  
  lineWidth : number = 1;

  private dir : Phaser.Math.Vector2;

  constructor(scene : Phaser.Scene, x1 : number, y1 : number, x2 : number, y2 : number, color? : number, lineSize? : number, gapSize? : number, lineWidth? : number){
    super(scene);
    scene.add.existing(this);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.lineSize = lineSize;
    this.gapSize = gapSize;
    this.lineWidth = lineWidth;
  }

  private distanceBetween(x1 : number, y1 : number, x2 : number, y2 : number){
    return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
  }

  draw() : void{
    this.dir = new Phaser.Math.Vector2(this.x2 - this.x1, this.y2 - this.y1);
    this.dir.normalize();

    this.clear();
    this.lineStyle(this.lineWidth, this.color, 1);
    let curX = this.x1;
    let curY = this.y1;
    while(this.distanceBetween(curX, curY, this.x2, this.y2) > this.lineSize + this.gapSize){
      this.lineBetween(curX, curY, curX + this.dir.x * this.lineSize, curY + this.dir.y * this.lineSize);
      curX += this.dir.x * (this.lineSize + this.gapSize);
      curY += this.dir.y * (this.lineSize + this.gapSize);
    }
    let lastDistance = this.distanceBetween(curX, curY, this.x2, this.y2);
    this.lineBetween(curX, curY, curX + this.dir.x * Math.min(this.lineSize, lastDistance), curY + this.dir.y * Math.min(this.lineSize, lastDistance));
  }

}