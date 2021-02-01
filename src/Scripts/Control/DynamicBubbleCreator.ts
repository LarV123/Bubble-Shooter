import * as Phaser from "phaser";
import DynamicBubbleFactory from "../Interfaces/DynamicBubbleFactory";
import BubbleCreatedCallback from "../Interfaces/BubbleCreatedCallback";
import DynamicBubble from "../Object/Bubble/DynamicBubble";
import ColorGenerator from "../Interfaces/ColorGenerator";

export default class DynamicBubbleCreator implements DynamicBubbleFactory{

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

  createDynamicBubble(x?: number, y?: number): DynamicBubble {
    let bubble : DynamicBubble;
    if(x && y){
      if(this.colorRandomizer != null){
        bubble = new DynamicBubble(this.scene, x, y, this.colorRandomizer.generateColor());
      }else{
        bubble = new DynamicBubble(this.scene, x, y);
      }
    }else if(x){
      if(this.colorRandomizer != null){
        bubble = new DynamicBubble(this.scene, x, x, this.colorRandomizer.generateColor());
      }else{
        bubble = new DynamicBubble(this.scene, x, x);
      }
    }else{
      if(this.colorRandomizer != null){
        bubble = new DynamicBubble(this.scene, this.spawnX, this.spawnY, this.colorRandomizer.generateColor());
      }else{
        bubble = new DynamicBubble(this.scene, this.spawnX, this.spawnY);
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