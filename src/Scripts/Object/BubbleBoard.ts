import * as Phaser from "phaser";
import DynamicBubble from "./Bubble/DynamicBubble";
import StaticBubble from "./Bubble/StaticBubble";
import {BUBBLE_RADIUS} from "./Bubble/Bubble";
import StaticBubbleFactory from "../Interfaces/StaticBubbleFactory";
import ConnectedColorBubblePopper from "../Control/ConnectedColorBubblePopper";
import BubblePopper from "../Interfaces/BubblePopper";
import HangingBubbleCleaner from "../Control/HangingBubbleCleaner";

export default class BubbleBoard extends Phaser.GameObjects.GameObject{

  private group : Phaser.Physics.Arcade.StaticGroup;

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

    this.arrayLength = [8, 7];

    this.group = scene.physics.add.staticGroup();

    this.sameColorPopper = new ConnectedColorBubblePopper(this);
    this.hangingBubbleCleaner = new HangingBubbleCleaner(this);

    for(let i : number = 0; i < 5; i++){
      this.generateRowOfBubble(i);
    }
  }

  private generateRowOfBubble(indexY : number) : void{
    for(let i:number = 0; i < this.arrayLength[indexY%2]; i++){
      let staticBubble : StaticBubble = this.staticBubbleFactory.createStaticBubble(this.calculatePosX(i, indexY), this.calculatePosY(indexY));
      this.insert(staticBubble, i, indexY);
    }
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
    this.bubbleBoard[indexY][indexX].destroy();
    this.bubbleBoard[indexY][indexX] = null;
  }

  popHangingBubble(){
    this.hangingBubbleCleaner.clean();
  }

  cleanBubbleBoard(){
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

  private getIndexX(indexY : number, bubble : DynamicBubble) : number{
    if(this.arrayLength[indexY%2] == 7){
      bubble.x -= bubble.body.width/2;
    }
    return Math.floor(bubble.x / bubble.body.width);
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

  isOutOfBound(indexX : number, indexY : number) : boolean{
    if(indexY < 0 || indexY >= this.bubbleBoard.length || indexX < 0 || indexX >= this.bubbleBoard[indexY].length){
      return true;
    }
  }

  attach(bubble : DynamicBubble){
    let indexY : number = this.getIndexY(bubble);
    let indexX : number = this.getIndexX(indexY, bubble);
    let posX : number = this.calculatePosX(indexX, indexY);
    let posY : number = this.calculatePosY(indexY);
    this.insert(new StaticBubble(this.scene, posX, posY, bubble.getColor()), indexX, indexY);
    bubble.destroy();
    this.sameColorPopper.pop(indexX, indexY);
  }

  getStaticGroup() : Phaser.Physics.Arcade.StaticGroup {
    return this.group;
  }

  getBubbleBoard() : ReadonlyArray<ReadonlyArray<StaticBubble>> {
    return this.bubbleBoard;
  }

}