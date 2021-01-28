import { Vector } from "matter";
import * as Phaser from "phaser";
import Bubble from "../Object/Bubble";
import BubbleBoard from "../Object/BubbleBoard";
import Pointer from "../Object/Pointer"

export default class GameScene extends Phaser.Scene {

  private bubbleBoard : BubbleBoard;
  private pointer : Pointer;
  private ballSpawnPoint : Phaser.Math.Vector2;

  private shootAngle : number;

  private isLastDown : boolean = false;

  private currentBubble : Bubble;

  constructor() {
    super({ key: "GameScene" });
  }

  preload(): void {
     
  }

  create(): void {

    this.ballSpawnPoint = new Phaser.Math.Vector2(this.cameras.main.centerX, this.cameras.main.height-200)

    this.bubbleBoard = new BubbleBoard(this);
    this.pointer = new Pointer(this, this.ballSpawnPoint.x, this.ballSpawnPoint.y);
    this.pointer.setDisplayOrigin(this.pointer.width/2, this.pointer.height/2 + 100);
    this.currentBubble = new Bubble(this, this.ballSpawnPoint.x, this.ballSpawnPoint.y);

    this.physics.world.on("worldbounds", this.onWorldBound, this);
  }

  private onWorldBound(body : Phaser.Physics.Arcade.Body, topCollision : boolean) : void{
    if(topCollision && body.gameObject instanceof Bubble){
      let bubble : Bubble = (body.gameObject as Bubble);
      this.bubbleBoard.bubbleAttached(bubble);
    }
  }

  update(): void {
    this.updateShootAngle();
    this.pointer.setRotation(this.shootAngle + Math.PI/2);

    if(!this.isLastDown && this.input.activePointer.isDown){
      this.currentBubble.shoot(this.shootAngle);
      this.currentBubble = new Bubble(this, this.ballSpawnPoint.x, this.ballSpawnPoint.y);
    }

    this.isLastDown = this.input.activePointer.isDown;

  }

  private updateShootAngle() : void {
    let pos : Phaser.Math.Vector2 = new Phaser.Math.Vector2(this.input.x, this.input.y);
    let angle : number = Phaser.Math.Vector2.ZERO.add(pos).subtract(this.ballSpawnPoint).normalize().angle();
    if(angle >= Math.PI + 0.2 && angle <= 2 * Math.PI - 0.2){
      this.shootAngle = angle;
    } else if(angle < 3/2 * Math.PI && angle > 1/2 * Math.PI){
      this.shootAngle = Math.PI + 0.2;
    }else {
      this.shootAngle = 2 * Math.PI - 0.2;
    }
  }
}
