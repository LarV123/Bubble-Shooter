import * as Phaser from "phaser";
import DynamicBubble from "../Object/Bubble/DynamicBubble";
import DynamicBubbleFactory from "../Interfaces/DynamicBubbleFactory";
import Pointer from "../Object/Pointer";

export default class ShootControl {

  private nextBubble : DynamicBubble;
  private currentBubble : DynamicBubble;
  private bubbleFactory : DynamicBubbleFactory;
  
  private shootAngle : number;

  private pointer : Pointer

  private mouseX : number;
  private mouseY : number;

  private shootPosX : number;
  private shootPosY : number;

  constructor(bubbleFactory : DynamicBubbleFactory, pointer : Pointer, shootPosX : number, shootPosY : number){
    this.bubbleFactory = bubbleFactory;
    this.pointer = pointer;
    this.shootPosX = shootPosX;
    this.shootPosY = shootPosY;
    this.nextBubble = this.bubbleFactory.createDynamicBubble();
    this.createBubble();
  }

  shoot() : void{
    this.currentBubble.shoot(this.shootAngle);
    this.createBubble();
  }

  private createBubble() : void{
    this.currentBubble = this.nextBubble;
    this.currentBubble.x = this.shootPosX;
    this.currentBubble.y = this.shootPosY;
    this.nextBubble = this.bubbleFactory.createDynamicBubble();
  }

  update(mouseX : number, mouseY : number) : void{
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    this.updateShootAngle();
    this.pointer.setRotation(this.shootAngle + Math.PI/2);
  }

  private updateShootAngle() : void {
    let pos : Phaser.Math.Vector2 = new Phaser.Math.Vector2(this.mouseX, this.mouseY);
    let angle : number = Phaser.Math.Vector2.ZERO.add(pos).subtract(new Phaser.Math.Vector2(this.currentBubble.x, this.currentBubble.y)).normalize().angle();
    if(angle >= Math.PI + 0.2 && angle <= 2 * Math.PI - 0.2){
      this.shootAngle = angle;
    } else if(angle < 3/2 * Math.PI && angle > 1/2 * Math.PI){
      this.shootAngle = Math.PI + 0.2;
    }else {
      this.shootAngle = 2 * Math.PI - 0.2;
    }
  }

}