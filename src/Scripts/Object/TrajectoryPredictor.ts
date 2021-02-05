import * as Phaser from "phaser";
import BubbleBoard from "./BubbleBoard";
import { BUBBLE_RADIUS } from "./Bubble/Bubble";
import Pointer from "./Pointer";
import DashedLine from "./DashedLine";
import * as Constant from "../Util/Constant";
import GameScreen from "./GameScreen";

export default class TrajectoryPredictor extends Phaser.GameObjects.Graphics{

  private startX : number;
  private startY : number;

  private maxLength : number = 1000;
  private offsetFromStartingLength = 170;

  private leftBound : Phaser.Geom.Line;
  private rightBound : Phaser.Geom.Line;
  private lines : Phaser.Geom.Line[];
  private dashedLine : DashedLine[];
  private maxReflection = 10;

  private bubbleShapeList : Phaser.Geom.Circle;

  private pointer : Pointer;

  private bubbleBoard : BubbleBoard;

  constructor(scene : Phaser.Scene, startX : number, startY : number, bubbleBoard : BubbleBoard, pointer : Pointer){
    super(scene, { lineStyle: { width: 4, color: 0x0000aa}});
    scene.add.existing(this);
    this.bubbleBoard = bubbleBoard;
    this.startX = startX;
    this.startY = startY;
    this.pointer = pointer;
    this.leftBound = new Phaser.Geom.Line(GameScreen.getInstance().getRelativePosX(BUBBLE_RADIUS),GameScreen.getInstance().getRelativePosY(0),
    GameScreen.getInstance().getRelativePosX(BUBBLE_RADIUS), GameScreen.getInstance().getRelativePosY(Constant.DEFAULT_HEIGHT));
    this.rightBound = new Phaser.Geom.Line(GameScreen.getInstance().getRelativePosX(Constant.DEFAULT_WIDTH-BUBBLE_RADIUS),GameScreen.getInstance().getRelativePosY(0),
    GameScreen.getInstance().getRelativePosX(Constant.DEFAULT_WIDTH-BUBBLE_RADIUS), GameScreen.getInstance().getRelativePosY(Constant.DEFAULT_HEIGHT));
    this.offsetFromStartingLength = GameScreen.getInstance().resize(this.offsetFromStartingLength);
    this.dashedLine = [];
    this.lines = [];
    for(let i = 0; i < this.maxReflection; i++){
      this.lines.push(new Phaser.Geom.Line(0,0,0,0));
      this.dashedLine.push(new DashedLine(scene, 0, 0, 0, 0, 0xffffff, GameScreen.getInstance().resize(20), GameScreen.getInstance().resize(20), GameScreen.getInstance().resize(10)));
    }
  }

  onPointerMove(){

    let dirVector = new Phaser.Math.Vector2(Math.cos(this.pointer.getAimAngle()), Math.sin(this.pointer.getAimAngle()));
    dirVector = dirVector.normalize();
    
    Phaser.Geom.Line.SetToAngle(this.lines[0], this.startX + dirVector.x * this.offsetFromStartingLength, this.startY + dirVector.y * this.offsetFromStartingLength, this.pointer.getAimAngle(), this.maxLength);
  }

  private checkBubbleIntersection(line : Phaser.Geom.Line) : any {
    let intersection =null;
    let minDist = Number.MAX_VALUE;
    for (let i = this.bubbleBoard.getBubbleBoard().length-1; i >= 0; i--) {
      const element = this.bubbleBoard.getBubbleBoard()[i];

      for (let j = 0; j < element.length; j++) {
        const bubble = element[j];
        if(bubble){
          let shape = bubble.getCircleShape();
          let curIntersection = Phaser.Geom.Intersects.GetLineToCircle(line, shape);
          for (let i = 0; i < curIntersection.length; i++) {
            const point = curIntersection[i];
            const curDist = Phaser.Math.Distance.Between(line.x1, line.y1, point.x, point.y);
            if(curDist < minDist){
              intersection = point;
              minDist = curDist;
            }
          }
        }
      }
      if(intersection){
        break;
      }
    }
    return intersection;
  }

  private traceReflection(index : number) : number{
    let bubbleIntersect = this.checkBubbleIntersection(this.lines[index]);
    if(bubbleIntersect){
      this.lines[index].x2 = bubbleIntersect.x;
      this.lines[index].y2 = bubbleIntersect.y;
      return 0;
    }
    if(index >= this.maxReflection-1) return 0;
    let intersectionPoint;
    let reflectAngle;
    if(Phaser.Geom.Intersects.LineToLine(this.lines[index], this.leftBound)){
      reflectAngle = Phaser.Geom.Line.ReflectAngle(this.lines[index], this.leftBound);
      intersectionPoint = Phaser.Geom.Intersects.GetLineToLine(this.lines[index], this.leftBound);
    }else if(Phaser.Geom.Intersects.LineToLine(this.lines[index], this.rightBound)){
      reflectAngle = Phaser.Geom.Line.ReflectAngle(this.lines[index], this.rightBound);
      intersectionPoint = Phaser.Geom.Intersects.GetLineToLine(this.lines[index], this.rightBound);
    }
    if(!intersectionPoint){
      return 0;
    }
    this.lines[index].x2 = intersectionPoint.x;
    this.lines[index].y2 = intersectionPoint.y;
    let dir = new Phaser.Math.Vector2(Math.cos(reflectAngle), Math.sin(reflectAngle));
    Phaser.Geom.Line.SetToAngle(this.lines[index+1], intersectionPoint.x + dir.x * 1, intersectionPoint.y + dir.y * 1, reflectAngle, this.maxLength);
    return 1 + this.traceReflection(index+1);
  }

  update() : void{

    this.onPointerMove();

    let reflectionCount = this.traceReflection(0);

    for(let i = 0; i < 1 + reflectionCount; i++){
      this.dashedLine[i].x1 = this.lines[i].x1;
      this.dashedLine[i].y1 = this.lines[i].y1;
      this.dashedLine[i].x2 = this.lines[i].x2;
      this.dashedLine[i].y2 = this.lines[i].y2;
    }

    for(let i = 0; i < this.dashedLine.length; i++){
      this.dashedLine[i].clear();
    }

    for(let i = 0; i < 1+reflectionCount; i++){
      this.dashedLine[i].draw();
    }
  }

}