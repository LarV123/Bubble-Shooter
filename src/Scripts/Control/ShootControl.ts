import * as Phaser from "phaser";
import DynamicBubble from "../Object/Bubble/DynamicBubble";
import DynamicBubbleFactory from "../Interfaces/DynamicBubbleFactory";
import Pointer from "../Object/Pointer";
import Activable from "../Interfaces/Activable";
import { Vector } from "matter";

export default class ShootControl implements Activable{

  private currentBubble : DynamicBubble;
  private bubbleFactory : DynamicBubbleFactory;
  
  private shootAngle : number;

  private pointer : Pointer

  private pointerX : number;
  private pointerY : number;

  private active : boolean = true;
  private input : Phaser.Input.InputPlugin;

  private isLastDown : boolean = false;
  private lastDownPos : Phaser.Math.Vector2;

  private firstFrame = true;

  constructor(input : Phaser.Input.InputPlugin, bubbleFactory : DynamicBubbleFactory, pointer : Pointer){
    this.input = input;
    this.bubbleFactory = bubbleFactory;
    this.pointer = pointer;
    this.lastDownPos = Phaser.Math.Vector2.ZERO.clone();
    this.shootAngle = 3 * Math.PI/2;
    this.createBubble();
  }

  SetActive(value: boolean): void {
    this.active = value;
  }

  IsActive(): boolean {
    return this.active;
  }

  shoot() : void{
    // console.log(this.shootAngle);
    if(this.active){
      this.currentBubble.shoot(this.shootAngle);
      this.createBubble();
    }
  }

  private createBubble() : void{
    this.currentBubble = this.bubbleFactory.createDynamicBubble();
  }

  update() : void{
    if(this.firstFrame && this.input.activePointer.isDown){
      return;
    }else if(this.firstFrame && !this.input.activePointer.isDown){
      this.firstFrame = false;
    }
    this.pointerX = this.input.x;
    this.pointerY = this.input.y;
    if(!this.isLastDown && this.input.activePointer.isDown){
      this.lastDownPos.x = this.pointerX;
      this.lastDownPos.y = this.pointerY;
    }
    if(this.active){
      this.touchInputUpdate();
      // this.clickMouseUpdate();
    }
    this.isLastDown = this.input.activePointer.isDown;
  }

  //#region touch input

  private touchInputUpdate(){
    if(this.input.activePointer.isDown){
      this.updateTouchBasedShootAngle();
    }
    if(this.isLastDown && !this.input.activePointer.isDown && this.isTouchOnValid()){
      this.shoot();
    }
    this.pointer.setRotation(this.shootAngle + Math.PI/2);
  }

  private updateTouchBasedShootAngle() : void{
    let curPos : Phaser.Math.Vector2 = new Phaser.Math.Vector2(this.pointerX, this.pointerY);
    let vec : Phaser.Math.Vector2 = new Phaser.Math.Vector2(this.currentBubble.x, this.currentBubble.y).subtract(curPos);
    let prevAngle = this.shootAngle;
    this.shootAngle = vec.angle();
    if(!this.isOnAngleRange()){
      this.shootAngle = prevAngle;
    }
    this.constraintAngle();
  }

  private isTouchOnValid() : boolean{
    let curPos : Phaser.Math.Vector2 = new Phaser.Math.Vector2(this.pointerX, this.pointerY);
    let vec : Phaser.Math.Vector2 = new Phaser.Math.Vector2(this.currentBubble.x, this.currentBubble.y).subtract(curPos);
    return this.isOnAngleRange(vec.angle());
  }

  //#endregion

  //#region mouse input

  private clickMouseUpdate() : void{
    this.updateMouseBasedShootAngle();
    this.pointer.setRotation(this.shootAngle + Math.PI/2);
    if(!this.isLastDown && this.input.activePointer.isDown){
      this.shoot();
    }
  }

  private updateMouseBasedShootAngle() : void {
    let pos : Phaser.Math.Vector2 = new Phaser.Math.Vector2(this.pointerX, this.pointerY);
    let vec : Phaser.Math.Vector2 = pos.clone().subtract(new Phaser.Math.Vector2(this.currentBubble.x, this.currentBubble.y));
    let angle : number = vec.normalize().angle();
    this.shootAngle = angle;
    this.constraintAngle();
  }

  //#endregion

  private constraintAngle(){
    if(this.shootAngle >= Math.PI + 0.2 && this.shootAngle <= 2 * Math.PI - 0.2){
      
    } else if(this.shootAngle < 3/2 * Math.PI && this.shootAngle > 1/2 * Math.PI){
      this.shootAngle = Math.PI + 0.2;
    }else {
      this.shootAngle = 2 * Math.PI - 0.2;
    }
  }

  private isOnAngleRange(angle ? :number){
    if(angle){
      return (angle >= Math.PI + 0.2 && angle <= 2 * Math.PI - 0.2)
    }
    return (this.shootAngle >= Math.PI + 0.2 && this.shootAngle <= 2 * Math.PI - 0.2);
  }

}