import * as Phaser from "phaser";
import BubbleBoard from "./BubbleBoard";

export default class TrajectoryPredictor extends Phaser.GameObjects.Graphics{

  private startX : number;
  private startY : number;

  private maxLength : number = 1000;
  private offsetFromStartingLength = 170;

  private leftBound : Phaser.Geom.Line;
  private rightBound : Phaser.Geom.Line;
  private lines : Phaser.Geom.Line[];
  private maxLines = 10;

  private bubbleShapeList : Phaser.Geom.Circle;

  private bubbleBoard : BubbleBoard;

  constructor(scene : Phaser.Scene, startX : number, startY : number, bubbleBoard : BubbleBoard){
    super(scene, { lineStyle: { width: 4, color: 0xaa00aa, }});
    scene.add.existing(this);
    this.bubbleBoard = bubbleBoard;
    this.startX = startX;
    this.startY = startY;

    this.leftBound = new Phaser.Geom.Line(30,0,30, this.scene.cameras.main.height);
    this.rightBound = new Phaser.Geom.Line(this.scene.cameras.main.width-30,0,this.scene.cameras.main.width-30, this.scene.cameras.main.height);

    this.lines = [];
    for(let i = 0; i < this.maxLines; i++){
      this.lines.push(new Phaser.Geom.Line(0,0,0,0));
    }
  }

  onPointerMove(pointer){

    let dirVector = new Phaser.Math.Vector2(pointer.x - this.startX, pointer.y - this.startY);
    dirVector = dirVector.normalize();

    this.lines[0].x1 = this.startX + dirVector.x * this.offsetFromStartingLength;
    this.lines[0].y1 = this.startY + dirVector.y * this.offsetFromStartingLength;
    this.lines[0].x2 = this.lines[0].x1 + dirVector.x * this.maxLength;
    this.lines[0].y2 = this.lines[0].y1 + dirVector.y * this.maxLength;
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
    if(index >= this.maxLines-1) return 0;
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

    this.onPointerMove({x : this.scene.input.x, y: this.scene.input.y});

    let reflectionCount = this.traceReflection(0);

    this.clear();
    // for (let i = this.bubbleBoard.getBubbleBoard().length-1; i >= 0; i--) {
    //   const element = this.bubbleBoard.getBubbleBoard()[i];

    //   for (let j = 0; j < element.length; j++) {
    //     const bubble = element[j];
    //     if(bubble){
    //       let shape = bubble.getCircleShape();
    //       this.strokeCircleShape(shape);
    //     }
    //   }
    // }
    for(let i = 0; i < 1 + reflectionCount; i++){
      this.strokeLineShape(this.lines[i]);
    }
  }

}