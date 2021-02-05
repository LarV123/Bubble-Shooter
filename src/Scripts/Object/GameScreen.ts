import * as Phaser from "phaser";
import * as Constant from "../Util/Constant";

export default class GameScreen {

  private static instance : GameScreen;

  static createInstance(scene : Phaser.Scene, x : number, y : number){
    this.instance = new GameScreen(scene, x, y);
  }

  static getInstance(){
    return this.instance;
  }

  static TOP_LEFT = 0;
  static TOP_RIGHT = 1;
  static BOTTOM_LEFT = 2;
  static BOTTOM_RIGHT = 3;

  private x : number;
  private y : number;

  private width : number;
  private height : number;

  private scene : Phaser.Scene;

  constructor(scene : Phaser.Scene, x : number, y : number){
    this.x = x;
    this.y = y;
    this.scene = scene;

    let ratio = Constant.DEFAULT_WIDTH / Constant.DEFAULT_HEIGHT;
    let sceneWidth = this.scene.cameras.main.width;
    let sceneHeight = this.scene.cameras.main.height;
    let sceneRatio = sceneWidth / sceneHeight;

    if(ratio <= sceneRatio){
      this.width = sceneHeight * ratio;
      this.height = sceneHeight;
    }else{
      this.width = sceneWidth;
      this.height = sceneWidth / ratio;
    }

  }

  resizeX(x : number) : number{
    return x / Constant.DEFAULT_WIDTH * this.width;
  }

  resizeY(y : number) : number{
    return y / Constant.DEFAULT_HEIGHT * this.height;
  }

  resize(size : number){
    if(Constant.DEFAULT_HEIGHT < Constant.DEFAULT_WIDTH){
      return this.resizeY(size);
    }else{
      return this.resizeX(size);
    }
  }

  private topLeftX() : number{
    return this.x - this.width/2;
  }

  private topLeftY() : number{
    return this.y - this.height/2;
  }

  getRelativePosX(x : number) : number{
    return this.topLeftX() + this.resizeX(x);
  }

  getRelativePosY(y : number) : number{
    return this.topLeftY() + this.resizeY(y);
  }

  

}