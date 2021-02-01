import DynamicBubble from "../Object/Bubble/DynamicBubble";
import BubbleCreatedCallback from "../Interfaces/BubbleCreatedCallback";

export default interface DynamicBubbleFactory {
  createDynamicBubble(x?:number, y?:number) : DynamicBubble;
  addCreateListener(callback : BubbleCreatedCallback) : void;
  removeCreateListener(callback : BubbleCreatedCallback) : void;
}