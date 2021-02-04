import * as Phaser from "phaser";
import BubbleBoard from "../Object/BubbleBoard";
import GameOverMenu from "../Object/GameOverMenu";
import Activable from "../Interfaces/Activable";

export default class GameOverHandler {

  private scene : Phaser.Scene;
  private bubbleBoard : BubbleBoard;

  private isGameOver = false;
  private bubbleShiftTimer : Phaser.Time.TimerEvent;

  private gameOverMenu : GameOverMenu;

  private activables : Activable[];

  constructor(scene : Phaser.Scene, bubbleBoard : BubbleBoard, bubbleShiftTimer : Phaser.Time.TimerEvent, activables? : Activable[]){
    this.scene = scene;
    this.bubbleBoard = bubbleBoard;
    this.bubbleShiftTimer = bubbleShiftTimer;
    this.gameOverMenu = new GameOverMenu(scene, this);
    this.activables = activables;
  }

  update() : void{
    if(this.bubbleBoard.getBubbleBoard().length >= 11 && !this.isGameOver){
      this.bubbleShiftTimer.paused = true;
      this.isGameOver = true;
      this.gameOverMenu.setActive(true);
      if(this.activables){
        this.activables.forEach(element => {
          element.SetActive(false);
        });
      }
    }
    this.gameOverMenu.update();
  }

  restart() : void{
    this.scene.time.addEvent({delay:50, callback:()=>{this.scene.scene.restart()}, callbackScope:this});
  }

}