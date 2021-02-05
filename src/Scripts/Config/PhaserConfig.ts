export type PhaserConfig = Phaser.Types.Core.GameConfig;

import {getResolution} from '../Util/Util';
import PreloadScene from '../Scene/PreloadScene';
import GameScene from '../Scene/GameScene';
import TitleScene from '../Scene/TitleScene';
import LevelScene from '../Scene/LevelScene';

export const config: PhaserConfig = {
  title: "PhaserGame",
  type: Phaser.AUTO,
  scale: {
    parent: "phaser-game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: getResolution().width,
    height: getResolution().height,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  },
  backgroundColor: "#4fb8e5",
  scene: [PreloadScene, GameScene, TitleScene, LevelScene]
 
};
