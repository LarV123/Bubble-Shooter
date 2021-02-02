import BubbleBoard from "../Object/BubbleBoard";
import BubblePopper from "../Interfaces/BubblePopper";
import StaticBubble from "../Object/Bubble/StaticBubble";
import ConnectedBubblePopper from "./ConnectedBubblePopper";

export default class HangingBubbleCleaner {

  private bubbleBoard : BubbleBoard;
  private connectedBubblePopper : BubblePopper;

  private floodFillArray : boolean[][];

  constructor(bubbleBoard : BubbleBoard){
    this.bubbleBoard = bubbleBoard;
    this.connectedBubblePopper = new ConnectedBubblePopper(this.bubbleBoard);
  }

  clean() : void {
    this.floodFillArray = [];
    for(let i = 0; i < this.bubbleBoard.getBubbleBoard().length; i++){
      this.floodFillArray.push([]);
      for(let j = 0; j < this.bubbleBoard.getBubbleBoard()[i].length; j++){
        this.floodFillArray[i].push(false);
      }
    }
    for(let i = 0; i < this.floodFillArray[0].length; i++){
      this.floodFill(i, 0);
    }
    for(let i = 0; i < this.floodFillArray.length; i++){
      let str = "";
      for(let j = 0; j < this.floodFillArray[i].length; j++){
        str += this.floodFillArray[i][j];
        if(!this.floodFillArray[i][j]){
          this.connectedBubblePopper.pop(j, i, "fall");
        }
      }
    }
  }

  private floodFill(indexX : number, indexY : number) : void{
    if(indexY < 0 || indexY >= this.floodFillArray.length || indexX < 0 || indexX >= this.floodFillArray[indexY].length){
      return;
    }
    if(this.bubbleBoard.getBubbleBoard()[indexY][indexX] == null){
      return;
    }
    if(this.floodFillArray[indexY][indexX]){
      return;
    }
    this.floodFillArray[indexY][indexX] = true;
    let neighbourCell : number[][] = this.bubbleBoard.getNeighbourCell(indexX, indexY);
    neighbourCell.forEach(offset => {
      this.floodFill(indexX + offset[0], indexY + offset[1]);
    });
  }

}