import Phaser from "phaser";
import TextureKeys from "../consts/TextureKeys";
import AnimationKeys from "../consts/AnimationKeys";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }
  preload() {
    this.load.image(
      TextureKeys.Background,
      "public/house/bg_repeat_340x640.png"
    );
    this.load.atlas(
      TextureKeys.RocketMouse,
      "public/characters/rocket-mouse.png",
      "public/characters/rocket-mouse.json"
    );
    this.load.image(TextureKeys.MouseHole, "public/house/object_mousehole.png");
    this.load.image(TextureKeys.Window1, "public/house/object_window1.png");
    this.load.image(TextureKeys.Window2, "public/house/object_window2.png");
    this.load.image(TextureKeys.Bookcase1, "public/house/object_bookcase1.png");
    this.load.image(TextureKeys.Bookcase2, "public/house/object_bookcase2.png");
  }
  create() {
    this.anims.create({
      key: AnimationKeys.RocketMouseRun,
      frames: this.anims.generateFrameNames(TextureKeys.RocketMouse, {
        start: 1,
        end: 4,
        prefix: "rocketmouse_run",
        zeroPad: 2,
        suffix: ".png",
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.scene.start("game");
  }
}
