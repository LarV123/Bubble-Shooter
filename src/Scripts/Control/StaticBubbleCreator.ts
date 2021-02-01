import * as Phaser from "phaser";
import StaticBubble from "../Object/Bubble/StaticBubble";
import StaticBubbleFactory from "../Interfaces/StaticBubbleFactory";
import ColorGenerator from "../Interfaces/ColorGenerator";
import BubbleCreatedCallback from "../Interfaces/BubbleCreatedCallback";

export default class StaticBubbleCreator implements StaticBubbleFactory {
  
  private scene : Phaser.Scene;
  private spawnX : number;
  private spawnY : number;
  private colorRandomizer : ColorGenerator;
  
  private callbackList : BubbleCreatedCallback[];

  constructor(scene : Phaser.Scene, spawnX : number, spawnY : number, colorRandomizer : ColorGenerator){
    this.scene = scene;
    this.spawnX = spawnX;
    this.spawnY = spawnY;
    this.colorRandomizer = colorRandomizer;
    this.callbackList = [];
  }

  createStaticBubble(x?: number, y?: number): StaticBubble {
    let bubble : StaticBubble;
    if(x && y){
      if(this.colorRandomizer != null){
        bubble = new StaticBubble(this.scene, x, y, this.colorRandomizer.generateColor());
      }else{
        bubble = new StaticBubble(this.scene, x, y);
      }
    }else if(x){
      if(this.colorRandomizer != null){
        bubble = new StaticBubble(this.scene, x, x, this.colorRandomizer.generateColor());
      }else{
        bubble = new StaticBubble(this.scene, x, x);
      }
    }else{
      if(this.colorRandomizer != null){
        bubble = new StaticBubble(this.scene, this.spawnX, this.spawnY, this.colorRandomizer.generateColor());
      }else{
        bubble = new StaticBubble(this.scene, this.spawnX, this.spawnY);
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