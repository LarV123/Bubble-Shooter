import * as Phaser from "phaser";
import Bubble from "./Bubble";

export default class BubbleBoard extends Phaser.GameObjects.GameObject{

  private group : Phaser.Physics.Arcade.Group;

  private gameWidth : number;
  private gameHeight : number;

  private bubbleBoard : Bubble[][];

  private prevBubble : Bubble;

  constructor(scene : Phaser.Scene){
    super(scene, "Bubble Board");
    scene.add.existing(this);

    this.gameWidth = scene.cameras.main.width;
    this.gameHeight = scene.cameras.main.height;

  }

  bubbleAttached(bubble : Bubble){
    if(this.prevBubble){
      console.log(this.prevBubble.x);
    }
    bubble.attach();
    let posX : number = Math.floor(bubble.x / bubble.body.width);
    bubble.x = (bubble.body.width/2 + posX * bubble.body.width);
    this.prevBubble = bubble;
  }

}