import Bubble from "../Object/Bubble";

export interface BubbleFactory{
  createBubble(x? : number, y? : number) : Bubble;
}

export interface BubbleCreatedCallback{
  onBubbleCreated(bubble : Bubble) : void;
}