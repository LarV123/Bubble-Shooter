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
import GameOverHandler from "../Control/GameOverHandler";
import * as Constant from "../Util/Constant";
import GameScreen from "../Object/GameScreen";
import AlignTool from "../Util/AlignTool";

const DEFAULT_SPAWN_POS_X = Constant.DEFAULT_WIDTH/2;
const DEFAULT_SPAWN_POS_Y = Constant.DEFAULT_HEIGHT-200;

export default class GameScene extends Phaser.Scene implements BubbleCreatedCallback{

  private bubbleBoard : BubbleBoard;
  private ballSpawnPoint : Phaser.Math.Vector2;

  private shootControl : ShootControl;
  private colorControl : ColorControl;

  private hud : HUD;

  private trajectoryPredictor : TrajectoryPredictor;

  private pointer : Pointer;

  private gameOverHandler : GameOverHandler;

  private bubbleBoardShiftTimedEvent : Phaser.Time.TimerEvent;

  constructor() {
    super({ key: "GameScene" });
  }

  preload(): void {
     
  }

  create(): void {

    GameScreen.createInstance(this, this.cameras.main.centerX, this.cameras.main.centerY);

    ScoreSystem.getInstance().reset();

    this.bubbleBoard = new BubbleBoard(this, this.createStaticBubbleFactory());

    this.physics.world.setBounds(GameScreen.getInstance().getRelativePosX(0), GameScreen.getInstance().getRelativePosY(0),
    GameScreen.getInstance().resizeX(Constant.DEFAULT_WIDTH), GameScreen.getInstance().resizeY(Constant.DEFAULT_HEIGHT));

    this.ballSpawnPoint = new Phaser.Math.Vector2(GameScreen.getInstance().getRelativePosX(Constant.DEFAULT_WIDTH/2), GameScreen.getInstance().getRelativePosY(Constant.DEFAULT_HEIGHT-200));
    
    this.colorControl = new ColorControl(this.bubbleBoard);

    this.hud = new HUD(this, this.colorControl);
    
    this.pointer = new Pointer(this, this.ballSpawnPoint.x, this.ballSpawnPoint.y);
    this.pointer.displayWidth = GameScreen.getInstance().resizeX(this.pointer.displayWidth);
    this.pointer.displayHeight = GameScreen.getInstance().resizeY(this.pointer.displayHeight);
    this.pointer.setDisplayOrigin(this.pointer.width/2, this.pointer.height/2 + 100);

    this.shootControl = new ShootControl(this.input, this.createDynamicBubbleFactory(), this.pointer);

    this.physics.world.on("worldbounds", this.onWorldBound, this);

    this.trajectoryPredictor = new TrajectoryPredictor(this, this.ballSpawnPoint.x, this.ballSpawnPoint.y, this.bubbleBoard, this.pointer);

    this.bubbleBoardShiftTimedEvent = this.time.addEvent({delay:10000, loop:true, callback:()=>{this.bubbleBoard.shiftDown()}, callbackScope:this});

    this.gameOverHandler = new GameOverHandler(this, this.bubbleBoard, this.bubbleBoardShiftTimedEvent, [this.shootControl]);

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
    this.shootControl.update();
    this.gameOverHandler.update();
    this.bubbleBoard.update();
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
