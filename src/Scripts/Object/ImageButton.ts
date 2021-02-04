import * as Phaser from "phaser";

export default class ImageButton extends Phaser.GameObjects.Image{

  constructor(scene : Phaser.Scene, x : number, y : number, image : string){
    super(scene, x, y, image);
    this.scene.add.existing(this);
    this.setInteractive();
    this.on("pointerover", this.onHover, this);
    this.on("pointerdown", this.onClick, this);
    this.on("pointerout", this.onOut, this);
  }

  private onHover(){
    this.setTint(0xeeeeee);
  }

  private onClick(){
    this.setTint(0xaaaaaa);
    this.emit("click");
  }

  private onOut(){
    this.setTint(0xffffff);
  }

}