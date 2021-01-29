import { Vector } from "matter";
import * as Phaser from "phaser";
import Bubble from "../Object/Bubble";
import BubbleBoard from "../Object/BubbleBoard";
import Pointer from "../Object/Pointer"
import ShootControl from "../Control/ShootControl";
import BubbleSpawner from "../Control/BubbleSpawner";
import {BubbleFactory, BubbleCreatedCallback} from "../Interfaces/BubbleFactory";
import ColorControl from "../Control/ColorControl";

export default class GameScene extends Phaser.Scene implements BubbleCreatedCallback{

  private bubbleBoard : BubbleBoard;
  private ballSpawnPoint : Phaser.Math.Vector2;

  private shootControl : ShootControl;

  private isLastDown : boolean = false;

  private colorControl : ColorControl;

  constructor() {
    super({ key: "GameScene" });
  }

  preload(): void {
     
  }

  create(): void {

    this.ballSpawnPoint = new Phaser.Math.Vector2(this.cameras.main.centerX, this.cameras.main.height-200)

    this.bubbleBoard = new BubbleBoard(this);

    this.colorControl = new ColorControl(this);

    this.shootControl = new ShootControl(this.createBubbleFactory(), this.createPointer());

    this.physics.world.on("worldbounds", this.onWorldBound, this);
  }

  private createBubbleFactory() : BubbleFactory{
    let bubbleSpawner : BubbleSpawner = new BubbleSpawner(this, this.ballSpawnPoint.x, this.ballSpawnPoint.y, this.colorControl);
    bubbleSpawner.addCreateListener(this);
    return bubbleSpawner;
  }

  private createPointer() : Pointer {
    let pointer : Pointer = new Pointer(this, this.ballSpawnPoint.x, this.ballSpawnPoint.y);
    pointer.setDisplayOrigin(pointer.width/2, pointer.height/2 + 100)
    return pointer;
  }

  private onWorldBound(body : Phaser.Physics.Arcade.Body, topCollision : boolean) : void{
    if(topCollision && body.gameObject instanceof Bubble){
      let bubble : Bubble = (body.gameObject as Bubble);
      this.bubbleBoard.bubbleAttached(bubble);
    }
  }

  update(): void {
    this.colorControl.update();
    this.shootControl.update(this.input.x, this.input.y);
    if(!this.isLastDown && this.input.activePointer.isDown){
      this.shootControl.shoot();
    }
    this.isLastDown = this.input.activePointer.isDown;
  }

  onBubbleCreated(bubble: Bubble): void {
    this.physics.add.collider(bubble, this.bubbleBoard.getStaticGroup(), this.onBallCollision, null, this);
  }

  private onBallCollision(obj1 : Phaser.GameObjects.GameObject, obj2 : Phaser.GameObjects.GameObject){
    if(obj1 instanceof Bubble && obj1.body != null){
      this.bubbleBoard.bubbleAttached(obj1 as Bubble);
    }
  }

}
