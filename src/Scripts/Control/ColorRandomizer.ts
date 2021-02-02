import * as Phaser from "phaser";
import ColorGenerator from "../Interfaces/ColorGenerator";
import Random from "../Util/Random";

export default class ColorRandomizer implements ColorGenerator{

  private colors : number[];

  constructor(){
    this.colors = [0xff5e5e, 0x5e9cff, 0x5eff73, 0xfcff63, 0xffa8f2, 0x4a4a4a];
  }

  generateColor() : number{
    return this.colors[Random.getRandomInteger(0, this.colors.length)];
  }

}