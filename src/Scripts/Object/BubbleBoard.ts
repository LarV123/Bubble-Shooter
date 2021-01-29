import * as Phaser from "phaser";
import Bubble from "./Bubble";
import StaticBubble from "./StaticBubble";

export default class BubbleBoard extends Phaser.GameObjects.GameObject{

  private group : Phaser.Physics.Arcade.StaticGroup;

  private bubbleBoard : StaticBubble[][];

  //length of even or odd array
  //0 for even
  //1 for odd
  private arrayLength : number[];

  constructor(scene : Phaser.Scene){
    super(scene, "Bubble Board");
    scene.add.existing(this);
    this.bubbleBoard = [];

    this.arrayLength = [8, 7];

    this.group = scene.physics.add.staticGroup();
  }

  private getIndexX(indexY : number, bubble : Bubble) : number{
    if(this.arrayLength[indexY%2] == 7){
      bubble.x -= bubble.body.width/2;
    }
    return Math.floor(bubble.x / bubble.body.width);
  }

  private getIndexY(bubble : Bubble) : number{
    console.log(bubble.body.height);
    return Math.floor(bubble.y / (bubble.body.height * Math.sqrt(3/4)));
  }

  private calculatePosX(indexX : number, indexY : number, bubble : Bubble) : number{
    if(this.arrayLength[indexY % 2] == 8){
      return bubble.body.width/2 + indexX * bubble.body.width;
    }else{
      return bubble.body.width + indexX * bubble.body.width;
    }
  }

  private calculatePosY(indexX : number, indexY : number, bubble : Bubble) : number{
    return bubble.body.height/2 + indexY * bubble.body.height * Math.sqrt(3/4);
  }

  bubbleAttached(bubble : Bubble){
    let indexY : number = this.getIndexY(bubble);
    let indexX : number = this.getIndexX(indexY, bubble);
    let posX : number = this.calculatePosX(indexX, indexY, bubble);
    let posY : number = this.calculatePosY(indexX, indexY, bubble);
    console.log(indexX + " " + indexY);
    while(indexY >= this.bubbleBoard.length){
      this.bubbleBoard.push(new Array<StaticBubble>(this.arrayLength[indexY % 2]));
    }
    this.bubbleBoard[indexY][indexX] = new StaticBubble(this.scene, posX, posY, bubble.getColor());
    this.group.add(this.bubbleBoard[indexY][indexX]);
    bubble.destroy();
  }

  getStaticGroup() : Phaser.Physics.Arcade.StaticGroup {
    return this.group;
  }

}