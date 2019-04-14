import { GameScene } from '../scenes/GameScene';

export class Player {
	public position: Phaser.Math.Vector3;
	public sprite: Phaser.GameObjects.Rectangle;
	public scene: GameScene | Phaser.Scene;

	constructor(scene: GameScene, x: number, y: number, z: number) {
		this.position = new Phaser.Math.Vector3(x, y, z);

		this.scene = scene;

		// this.sprite = this.scene.add.rectangle(this.position.x + this.scene.scale.gameSize.width / 2, this.scene.scale.gameSize.height - 20, 200, 100, 0xff0000, 1)
		// 				.setOrigin(0.5, 1).setDepth(100);
	}

	public get x(): number { return this.position.x; }
	public set x(x: number) {
		this.position.x = x;
		// this.sprite.x = x + this.scene.scale.gameSize.width / 2;
	}

	public get y(): number { return this.position.y; }
	public set y(y: number) {
		this.position.y = y;
	}

	public get z(): number { return this.position.z; }
	public set z(z: number) {
		this.position.z = z;
		// this.sprite.z = z;
	}
}
