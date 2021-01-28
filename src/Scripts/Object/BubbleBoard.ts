import * as Phaser from "phaser";
import Bubble from "./Bubble";

export default class BubbleBoard extends Phaser.GameObjects.GameObject{

  private group : Phaser.Physics.Arcade.Group;

  private gameWidth : number;
  private gameHeight : number;

  private bubbleBoard : Bubble[][];

  constructor(scene : Phaser.Scene){
    super(scene, "Bubble Board");
    scene.add.existing(this);

    this.gameWidth = scene.cameras.main.width;
    this.gameHeight = scene.cameras.main.height;

  }

  bubbleAttached(bubble : Bubble){
    let posX : number = Math.floor(bubble.x / bubble.body.width);
    let posY = bubble.height/2;
    this.scene.physics.add.staticSprite((bubble.body.width/2 + posX * bubble.body.width), posY, "bubble").setScale(bubble.scale);
    bubble.destroy();
  }

}