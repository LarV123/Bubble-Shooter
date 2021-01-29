import * as Phaser from "phaser";
import {BubbleFactory, BubbleCreatedCallback} from "../Interfaces/BubbleFactory";
import Bubble from "../Object/Bubble";
import ColorGenerator from "../Interfaces/ColorGenerator";

export default class BubbleSpawner implements BubbleFactory{

  private scene : Phaser.Scene;
  private colorRandomizer : ColorGenerator;
  private callbackList : BubbleCreatedCallback[];

  private spawnX : number;
  private spawnY : number;

  constructor(scene : Phaser.Scene, spawnX : number, spawnY : number, colorRandomizer? : ColorGenerator){
    this.scene = scene;
    this.colorRandomizer = colorRandomizer;
    this.spawnX = spawnX;
    this.spawnY = spawnY;
    this.callbackList = [];
  }

  createBubble(x?: number, y?: number): Bubble {
    let bubble : Bubble;
    if(x && y){
      if(this.colorRandomizer != null){
        bubble = new Bubble(this.scene, x, y, this.colorRandomizer.generateColor());
      }else{
        bubble = new Bubble(this.scene, x, y);
      }
    }else if(x){
      if(this.colorRandomizer != null){
        bubble = new Bubble(this.scene, x, x, this.colorRandomizer.generateColor());
      }else{
        bubble = new Bubble(this.scene, x, x);
      }
    }else{
      if(this.colorRandomizer != null){
        bubble = new Bubble(this.scene, this.spawnX, this.spawnY, this.colorRandomizer.generateColor());
      }else{
        bubble = new Bubble(this.scene, this.spawnX, this.spawnY);
      }
    }
    this.callbackList.forEach(callback => {
      callback.onBubbleCreated(bubble);
    });
    return bubble;
  }

  addCreateListener(callback : BubbleCreatedCallback) : void{
    this.callbackList.push(callback);
  }

  removeCreateListener(callback : BubbleCreatedCallback) : void{
    let index : number = this.callbackList.indexOf(callback, 0);
    if(index != -1){
      this.callbackList.splice(index, 1);
    }
  }

}