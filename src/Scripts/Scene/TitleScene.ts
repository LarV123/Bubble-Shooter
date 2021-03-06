import * as Phaser from "phaser";
import FpsText from "../Object/FpsText";
import DynamicBubble from "../Object/Bubble/DynamicBubble";

export default class TitleScene extends Phaser.Scene {
  private fpsText: FpsText;
  private group: Phaser.Physics.Arcade.Group;

  constructor() {
    super({ key: "TitleScene" });
  }

  preload(): void {}

  create(): void {

    this.group = this.physics.add.group({immovable:true});

    this.fpsText = new FpsText(this);
    this.physics.world.on("worldbounds", (body : Phaser.Physics.Arcade.Body, upCollision : boolean)=>{
      if(body.gameObject instanceof DynamicBubble && upCollision){
        (body.gameObject as DynamicBubble).attach();
        this.group.add(body.gameObject);
      }
    },
    this);
    this.physics.add.collider(new DynamicBubble(this, this.cameras.main.width/2 - 400, this.cameras.main.height - 100).shoot(-90), this.group, (obj1, obj2) => {
      (obj1 as DynamicBubble).attach();
      this.group.add(obj1);
    }, null, this);

    this.physics.add.collider(new DynamicBubble(this, this.cameras.main.width/2, this.cameras.main.height - 100).shoot(-45), this.group, (obj1, obj2) => {
      (obj1 as DynamicBubble).attach();
      this.group.add(obj1);
    }, null, this);
    
  }

  update(): void {
    this.fpsText.update();
  }
}
