import StaticBubble from "../Object/Bubble/StaticBubble"
import BubbleCreatedCallback from "../Interfaces/BubbleCreatedCallback";

export default interface StaticBubbleFactory {
  
  createStaticBubble(x? :number, y? :number) : StaticBubble;
  addCreateListener(callback : BubbleCreatedCallback) : void;
  removeCreateListener(callback : BubbleCreatedCallback) : void;
  
}