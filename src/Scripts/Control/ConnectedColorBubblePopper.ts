import BubbleBoard from "../Object/BubbleBoard";
import BubblePopper from "../Interfaces/BubblePopper";
import StaticBubble from "../Object/Bubble/StaticBubble";

export default class ConnectedColorBubblePopper implements BubblePopper{
  
  private bubbleBoard : BubbleBoard;

  private bubbleList : StaticBubble[];
  private popList : PopData[];
  private color : number;

  constructor(bubbleBoard : BubbleBoard){
    this.bubbleBoard = bubbleBoard;

    this.popList = [];
    this.bubbleList = [];
  }

  pop(indexX : number, indexY : number, anim ? : string){
    this.popList = [];
    this.bubbleList = [];
    this.color = this.bubbleBoard.getBubbleBoard()[indexY][indexX].getColor();
    this.popCheck(indexX, indexY);
    if(this.popList.length >= 3){
      for(let i : number = 0; i < this.popList.length; i++){
        let x : number = this.popList[i].indexX;
        let y : number = this.popList[i].indexY;
        this.bubbleBoard.remove(x, y);
      }
    }
    this.bubbleBoard.popHangingBubble();
    this.bubbleBoard.cleanBubbleBoard();
  }

  private popCheck(indexX : number, indexY : number) : void{
    if(this.bubbleBoard.isOutOfBound(indexX, indexY)){
      return;
    }
    let bubbleArray = this.bubbleBoard.getBubbleBoard();
    let currentBubble = bubbleArray[indexY][indexX];
    if(currentBubble == null || currentBubble.getColor() != this.color || this.bubbleList.indexOf(currentBubble) != -1){
      return;
    }
    this.bubbleList.push(currentBubble);
    this.popList.push(new PopData(indexX, indexY));
    let neighbourCell : number[][] = this.bubbleBoard.getNeighbourCell(indexX, indexY);
    neighbourCell.forEach(offset => {
      this.popCheck(indexX + offset[0], indexY + offset[1]);
    });
  }

}

class PopData {
  indexX : number;
  indexY : number;
  constructor(indexX : number, indexY : number){
    this.indexX = indexX;
    this.indexY = indexY;
  }
}