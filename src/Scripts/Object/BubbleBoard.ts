import * as Phaser from "phaser";
import DynamicBubble from "./Bubble/DynamicBubble";
import StaticBubble from "./Bubble/StaticBubble";
import {BUBBLE_RADIUS} from "./Bubble/Bubble";
import StaticBubbleFactory from "../Interfaces/StaticBubbleFactory";
import ConnectedColorBubblePopper from "../Control/ConnectedColorBubblePopper";
import BubblePopper from "../Interfaces/BubblePopper";
import HangingBubbleCleaner from "../Control/HangingBubbleCleaner";

export default class BubbleBoard extends Phaser.GameObjects.GameObject{

  private group : Phaser.Physics.Arcade.Group;

  private bubbleBoard : StaticBubble[][];

  //length of even or odd array
  //0 for even
  //1 for odd
  private arrayLength : number[];

  private staticBubbleFactory : StaticBubbleFactory;
  private sameColorPopper : BubblePopper;
  private hangingBubbleCleaner : HangingBubbleCleaner;

  constructor(scene : Phaser.Scene, staticBubbleFactory : StaticBubbleFactory){
    super(scene, "Bubble Board");
    scene.add.existing(this);
    this.bubbleBoard = [];
    this.staticBubbleFactory = staticBubbleFactory;

    this.arrayLength = [7, 8];

    this.group = scene.physics.add.group({immovable:true});
    this.sameColorPopper = new ConnectedColorBubblePopper(this);
    this.hangingBubbleCleaner = new HangingBubbleCleaner(this);

    for(let i : number = 0; i < 5; i++){
      this.shiftDown();
    }
  }

  //#region AFFECTING BOARD FUNCTION

  shiftDown() : void {
    this.bubbleBoard.unshift([]);
    this.swapArrayLength();
    for(let i = 0; i < this.bubbleBoard.length; i++){
      for(let j = 0; j < this.bubbleBoard[i].length; j++){
        if(this.bubbleBoard[i][j] != null){
          this.bubbleBoard[i][j].x = this.calculatePosX(j, i);
          this.bubbleBoard[i][j].y = this.calculatePosY(i);
        }
      }
    }
    this.generateRowOfBubble(0);
    this.printBoard();
  }

  attach(bubble : DynamicBubble){
    let indexY : number = this.getIndexY(bubble);
    let indexX : number = this.getIndexX(indexY, bubble);
    let posX : number = this.calculatePosX(indexX, indexY);
    let posY : number = this.calculatePosY(indexY);
    this.insert(new StaticBubble(this.scene, posX, posY, bubble.getColor()), indexX, indexY);
    this.printBoard();
    bubble.destroy();
    this.sameColorPopper.pop(indexX, indexY);
  }

  insert(staticBubble : StaticBubble, indexX : number, indexY : number) : void{
    this.remove(indexX, indexY);
    while(indexY >= this.bubbleBoard.length){
      this.bubbleBoard.push(new Array<StaticBubble>(this.arrayLength[indexY % 2]));
    }
    this.bubbleBoard[indexY][indexX] = staticBubble;
    this.group.add(this.bubbleBoard[indexY][indexX]);
  }

  remove(indexX : number, indexY : number, anim ? : string) : void{
    if(this.isOutOfBound(indexX, indexY) || this.bubbleBoard[indexY][indexX] == null){
      return;
    }
    if(anim){
      if(anim == "fall"){
        this.bubbleBoard[indexY][indexX].fall();
      }else{
        this.bubbleBoard[indexY][indexX].pop();
      }
    }else{
      this.bubbleBoard[indexY][indexX].pop();
    }
    this.bubbleBoard[indexY][indexX] = null;
  }

  popHangingBubble() : void{
    this.hangingBubbleCleaner.clean();
  }

  cleanBubbleBoard() : void{
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

  private generateRowOfBubble(indexY : number) : void{
    for(let i:number = 0; i < this.arrayLength[indexY%2]; i++){
      let staticBubble : StaticBubble = this.staticBubbleFactory.createStaticBubble(this.calculatePosX(i, indexY), this.calculatePosY(indexY));
      this.insert(staticBubble, i, indexY);
    }
  }

  //#endregion

  //#region UTILITY FUNCTION

  getNeighbourCell(indexX : number, indexY : number){
    if(this.arrayLength[indexY%2] == 8){
      return [[-1, -1], [0, -1], [1, 0], [0, 1], [-1, 1], [-1, 0]];
    }else{
      return [[1, -1], [1, 0], [1, 1], [0, 1], [-1, 0], [0, -1]];
    }
  }

  isOutOfBound(indexX : number, indexY : number) : boolean{
    if(indexY < 0 || indexY >= this.bubbleBoard.length || indexX < 0 || indexX >= this.bubbleBoard[indexY].length){
      return true;
    }
  }

  getAllColorInBoard() : number[] {
    let colors : number[] = [];
    for(let i = 0; i < this.bubbleBoard.length; i++){
      for(let j = 0; j < this.bubbleBoard[i].length; j++){
        if(this.bubbleBoard[i][j] != null){
          if(colors.indexOf(this.bubbleBoard[i][j].getColor()) == -1){
            colors.push(this.bubbleBoard[i][j].getColor());
          }
        }
      }
    }
    return colors;
  }

  private getIndexX(indexY : number, bubble : DynamicBubble) : number{
    if(this.arrayLength[indexY%2] == 7){
      bubble.x -= bubble.body.width/2;
    }
    return Math.min(Math.floor(bubble.x / bubble.body.width), this.arrayLength[indexY%2]-1);
  }

  private getIndexY(bubble : DynamicBubble) : number{
    return Math.floor(bubble.y / (bubble.body.height * Math.sqrt(3/4)));
  }

  private calculatePosX(indexX : number, indexY : number) : number{
    if(this.arrayLength[indexY % 2] == 8){
      return BUBBLE_RADIUS + indexX * BUBBLE_RADIUS * 2;
    }else{
      return BUBBLE_RADIUS * 2 + indexX * BUBBLE_RADIUS * 2;
    }
  }

  private calculatePosY(indexY : number) : number{
    return BUBBLE_RADIUS + indexY * BUBBLE_RADIUS * 2 * Math.sqrt(3/4);
  }

  private printBoard() :void{
    console.clear();
    for(let i = 0; i < this.bubbleBoard.length; i++){
      let str="";
      for(let j = 0; j < this.bubbleBoard[i].length; j++){
        if(this.bubbleBoard[i][j]){
          str += "O";
        }else{
          str += "X";
        }
      }
      console.log(str);
    }
  }

  private swapArrayLength() : void{
    let num : number = this.arrayLength[0];
    this.arrayLength[0] = this.arrayLength[1];
    this.arrayLength[1] = num;
  }

  //#endregion

  getPhysicsGroup() : Phaser.Physics.Arcade.Group {
    return this.group;
  }

  getBubbleBoard() : ReadonlyArray<ReadonlyArray<StaticBubble>> {
    return this.bubbleBoard;
  }

}