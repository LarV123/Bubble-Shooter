import * as Phaser from "phaser";
import ColorGenerator from "../Interfaces/ColorGenerator";
import Random from "../Util/Random";
import BubbleBoard from "../Object/BubbleBoard";

export default class ColorControl implements ColorGenerator {

  private bubbleBoard : BubbleBoard;

  private nextColor : number;
  private curColor : number;

  constructor( bubbleBoard : BubbleBoard){
    this.bubbleBoard = bubbleBoard;
    this.generateColor();
  }

  getNextColor() : number{
    return this.nextColor;
  }

  generateColor(): number {
    let colors : number[] = this.bubbleBoard.getAllColorInBoard();
    let curColor : number = this.nextColor;
    this.nextColor = colors[Random.getRandomInteger(0, colors.length)];
    return curColor;
  }

}