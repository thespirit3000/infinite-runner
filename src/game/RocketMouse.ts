import Phaser from "phaser";
import AnimationKeys from "../consts/AnimationKeys";
import TextureKeys from "../consts/TextureKeys";
import SceneKeys from "../consts/SceneKeys";

enum MouseState {
  Running,
  Killed,
  Dead,
}
export default class RocketMouse extends Phaser.GameObjects.Container {
  private flames: Phaser.GameObjects.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private mouse: Phaser.GameObjects.Sprite;
  private mouseState = MouseState.Running;

  enableJetPack(enabled: boolean) {
    this.flames.setVisible(enabled);
  }
  kill() {
    if (this.mouseState != MouseState.Running) {
      return;
    }

    this.mouseState = MouseState.Killed;
    this.mouse.play(AnimationKeys.RocketMouseDead);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAccelerationY(0);
    body.setVelocity(1000, 0);
    this.enableJetPack(false);
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.mouse = scene.add
      .sprite(0, 0, TextureKeys.RocketMouse)
      .setOrigin(0.5, 1)
      .play(AnimationKeys.RocketMouseRun);
    this.flames = scene.add
      .sprite(-63, -15, TextureKeys.RocketMouse)
      .play(AnimationKeys.RocketFlameOn);
    this.enableJetPack(false);

    this.add(this.flames);
    this.add(this.mouse);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.mouse.width, this.mouse.height);
    body.setOffset(this.mouse.width * -0.5, -this.mouse.height);

    this.cursors = scene.input.keyboard.createCursorKeys();
  }
  preUpdate() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    switch (this.mouseState) {
      case MouseState.Running: {
        if (this.cursors.space?.isDown) {
          body.setAccelerationY(-500);
          this.enableJetPack(true);
          this.mouse.play(AnimationKeys.RocketMouseFly, true);
        } else {
          body.setAccelerationY(0);
          this.enableJetPack(false);
        }

        if (body.blocked.down) {
          this.mouse.play(AnimationKeys.RocketMouseRun, true);
        } else if (body.velocity.y > 0) {
          this.mouse.play(AnimationKeys.RocketMouseFall, true);
        }
        break;
      }
      case MouseState.Killed: {
        body.velocity.x *= 0.99;
        if (body.velocity.x < 100) {
          this.mouseState = MouseState.Dead;
        }
        break;
      }
      case MouseState.Dead: {
        body.setVelocity(0, 0);
        this.scene.scene.run(SceneKeys.GameOver);
        break;
      }
    }
  }
}
