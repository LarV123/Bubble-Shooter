import * as Phaser from "phaser";
import ColorGenerator from "../Interfaces/ColorGenerator";
import Random from "../Util/Random";

export default class ColorControl implements ColorGenerator{

  private scene : Phaser.Scene;

  private colors : number[];

  private index : number = 0;

  private keySpace : Phaser.Input.Keyboard.Key;

  private isDownLast : boolean = false;

  constructor(scene : Phaser.Scene){
    this.scene = scene;
    this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE, true);
    this.colors = [0xff5e5e, 0x5e9cff, 0x5eff73];
  }

  update() : void{
    if(!this.isDownLast && this.keySpace.isDown){
      this.index++;
      if(this.index >= this.colors.length){
        this.index = 0;
      }
    }
    this.isDownLast = this.keySpace.isDown;
  }

  generateColor() : number{
    return this.colors[Random.getRandomInteger(0, this.colors.length)];
  }

}