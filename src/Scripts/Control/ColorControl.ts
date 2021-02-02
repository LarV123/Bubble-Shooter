import * as Phaser from "phaser";
import ColorGenerator from "../Interfaces/ColorGenerator";
import Random from "../Util/Random";
import BubbleBoard from "../Object/BubbleBoard";

export default class ColorControl implements ColorGenerator {

  private bubbleBoard : BubbleBoard;

  constructor( bubbleBoard : BubbleBoard){
    this.bubbleBoard = bubbleBoard;
  }

  generateColor(): number {
    let colors : number[] = this.bubbleBoard.getAllColorInBoard();
    return colors[Random.getRandomInteger(0, colors.length)];
  }

}