import * as Phaser from "phaser";
import Shopee from "../Object/Shopee"


export default class GameScene extends Phaser.Scene {

  constructor() {
    super({ key: "GameScene" });
  }

  preload(): void 
  {
     
  }

  create(): void 
  {
      new Shopee(this, this.cameras.main.width/2, this.cameras.main.height/2);
  }

  update(): void 
  {
  }
}
