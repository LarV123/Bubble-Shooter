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

  private isOutOfBound(indexX : number, indexY : number) : boolean{
    if(indexY < 0 || indexY >= this.bubbleBoard.length || indexX < 0 || indexX >= this.bubbleBoard[indexY].length){
      return true;
    }
  }

  private startPopCheck(indexX : number, indexY : number, color : number) : void {
    let bubbleList : StaticBubble[] = [];
    let indexList : number[][] = [];
    this.popCheck(indexX, indexY, color, bubbleList, indexList);
    if(bubbleList.length >= 3){
      for(let i:number = 0; i < bubbleList.length; i++){
        let x : number = indexList[i][0];
        let y : number = indexList[i][1];
        this.bubbleBoard[y][x] = null;
        bubbleList[i].destroy();
      }
    }
    let count : number = this.bubbleBoard.length - 1;
    while(count >= 0){
      let isAllNull = true;
      for(let i : number = 0; i < this.bubbleBoard[count].length; i++){
        if(this.bubbleBoard[count][i] != null){
          isAllNull = false;
        }
      }
      if(isAllNull){
        this.bubbleBoard.pop();
      }else{
        break;
      }
      count--;
    }
  }

  private neighbourCellOdd : number[][] = [[0, -1], [1, -1], [1, 0], [0, 1], [-1, 1], [-1, 0]];
  private neighbourCellEven : number[][] = [[-1, -1], [0, -1], [1, 0], [0, 1], [-1, 1], [-1, 0]];
  private popCheck(indexX : number, indexY : number, color : number, bubbleList : StaticBubble[], indexList : number[][]) : void{
    if(this.isOutOfBound(indexX, indexY)){
      return;
    }
    let curBubble : StaticBubble = this.bubbleBoard[indexY][indexX];
    if(curBubble == null || curBubble.getColor() != color || bubbleList.indexOf(curBubble) != -1){
      return;
    }
    bubbleList.push(curBubble);
    indexList.push([indexX, indexY]);
    if(indexY % 2 == 0){
      this.neighbourCellEven.forEach(offset => {
        this.popCheck(indexX + offset[0], indexY + offset[1], color, bubbleList, indexList);
      });
    }else{
      this.neighbourCellOdd.forEach(offset => {
        this.popCheck(indexX + offset[0], indexY + offset[1], color, bubbleList, indexList);
      });
    }
  }

  bubbleAttached(bubble : Bubble){
    let indexY : number = this.getIndexY(bubble);
    let indexX : number = this.getIndexX(indexY, bubble);
    let posX : number = this.calculatePosX(indexX, indexY, bubble);
    let posY : number = this.calculatePosY(indexX, indexY, bubble);
    while(indexY >= this.bubbleBoard.length){
      this.bubbleBoard.push(new Array<StaticBubble>(this.arrayLength[indexY % 2]));
    }
    this.bubbleBoard[indexY][indexX] = new StaticBubble(this.scene, posX, posY, bubble.getColor());
    this.group.add(this.bubbleBoard[indexY][indexX]);
    this.startPopCheck(indexX, indexY, bubble.getColor());
    bubble.destroy();
  }

  getStaticGroup() : Phaser.Physics.Arcade.StaticGroup {
    return this.group;
  }

}