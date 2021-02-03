import * as Phaser from "phaser";
import DynamicBubble from "../Object/Bubble/DynamicBubble";
import BubbleBoard from "../Object/BubbleBoard";
import Pointer from "../Object/Pointer"
import ShootControl from "../Control/ShootControl";
import DynamicBubbleCreator from "../Control/DynamicBubbleCreator";
import DynamicBubbleFactory from "../Interfaces/DynamicBubbleFactory";
import BubbleCreatedCallback from "../Interfaces/BubbleCreatedCallback";
import ColorControl from "../Control/ColorControl";
import ColorRandomizer from "../Control/ColorRandomizer";
import StaticBubbleFactory from "../Interfaces/StaticBubbleFactory";
import StaticBubbleCreator from "../Control/StaticBubbleCreator";
import TrajectoryPredictor from "../Object/TrajectoryPredictor";
import HUD from "../Object/HUD";
import ScoreSystem from "../Control/ScoreSystem";

export default class GameScene extends Phaser.Scene implements BubbleCreatedCallback{

  private bubbleBoard : BubbleBoard;
  private ballSpawnPoint : Phaser.Math.Vector2;

  private shootControl : ShootControl;
  private colorControl : ColorControl;

  private isLastDown : boolean = false;

  private isKeyDown : boolean = false;
  private keySpace : Phaser.Input.Keyboard.Key;

  private hud : HUD;

  private trajectoryPredictor : TrajectoryPredictor;

  private pointer : Pointer;

  private bubbleBoardShiftTimedEvent : Phaser.Time.TimerEvent;

  constructor() {
    super({ key: "GameScene" });
  }

  preload(): void {
     
  }

  create(): void {

    ScoreSystem.getInstance().reset();

    this.ballSpawnPoint = new Phaser.Math.Vector2(this.cameras.main.centerX, this.cameras.main.height-200);

    this.bubbleBoard = new BubbleBoard(this, this.createStaticBubbleFactory());
    
    this.colorControl = new ColorControl(this.bubbleBoard);

    this.hud = new HUD(this, this.colorControl);
    
    this.pointer = new Pointer(this, this.ballSpawnPoint.x, this.ballSpawnPoint.y);
    this.pointer.setDisplayOrigin(this.pointer.width/2, this.pointer.height/2 + 100)

    this.shootControl = new ShootControl(this.createDynamicBubbleFactory(), this.pointer);

    this.physics.world.on("worldbounds", this.onWorldBound, this);

    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.trajectoryPredictor = new TrajectoryPredictor(this, this.ballSpawnPoint.x, this.ballSpawnPoint.y, this.bubbleBoard, this.pointer);

    this.bubbleBoardShiftTimedEvent = this.time.addEvent({delay:10000, loop:true, callback:()=>{this.bubbleBoard.shiftDown()}, callbackScope:this});

  }

  private createStaticBubbleFactory() : StaticBubbleFactory {
    let bubbleCreator : StaticBubbleCreator = new StaticBubbleCreator(this, 0, 0, new ColorRandomizer());
    return bubbleCreator;
  }

  private createDynamicBubbleFactory() : DynamicBubbleFactory{
    let bubbleSpawner : DynamicBubbleCreator = new DynamicBubbleCreator(this, this.ballSpawnPoint.x, this.ballSpawnPoint.y, this.colorControl);
    bubbleSpawner.addCreateListener(this);
    return bubbleSpawner;
  }

  private onWorldBound(body : Phaser.Physics.Arcade.Body, topCollision : boolean) : void{
    this.sound.play("bubble_bounce", {volume:0.3, detune:100});
    if(topCollision && body.gameObject instanceof DynamicBubble){
      let bubble : DynamicBubble = (body.gameObject as DynamicBubble);
      this.bubbleBoard.attach(bubble);
    }
  }

  update(): void {
    this.hud.setProgress(this.bubbleBoardShiftTimedEvent.getProgress());
    this.trajectoryPredictor.update();
    this.hud.update();
    this.hud.setScore(ScoreSystem.getInstance().getScore());
    this.shootControl.update(this.input.x, this.input.y);
    if(!this.isLastDown && this.input.activePointer.isDown){
      this.shootControl.shoot();
    }
    this.isLastDown = this.input.activePointer.isDown;
    if(!this.isKeyDown && this.keySpace.isDown){
      this.bubbleBoard.shiftDown();
    }
    this.isKeyDown = this.keySpace.isDown;
  }

  onBubbleCreated(bubble: DynamicBubble): void {
    this.physics.add.collider(bubble, this.bubbleBoard.getPhysicsGroup(), this.onBallCollision, null, this);
  }

  private onBallCollision(obj1 : Phaser.GameObjects.GameObject, obj2 : Phaser.GameObjects.GameObject){
    if(obj1 instanceof DynamicBubble && obj1.body != null){
      this.bubbleBoard.attach(obj1 as DynamicBubble);
    }
  }

}
