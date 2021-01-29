import * as Phaser from "phaser";
import Bubble from "../Object/Bubble";
import BubbleFactory from "../Interfaces/BubbleFactory";
import Pointer from "../Object/Pointer";

export default class ShootControl {

  private currentBubble : Bubble;
  private bubbleFactory : BubbleFactory;
  
  private shootAngle : number;

  private pointer : Pointer

  private mouseX : number;
  private mouseY : number;

  constructor(bubbleFactory : BubbleFactory, pointer : Pointer){
    this.bubbleFactory = bubbleFactory;
    this.pointer = pointer;
    this.createBubble();
  }

  shoot() : void{
    this.currentBubble.shoot(this.shootAngle);
    this.createBubble();
  }

  private createBubble() : void{
    this.currentBubble = this.bubbleFactory.createBubble();
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