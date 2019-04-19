import { GameScene } from '../scenes/GameScene';

export class Prop {
	public scene: GameScene;
	public sprite: Phaser.GameObjects.Sprite;
	public offset: number;
	public height: number;
	public collides: boolean;
	public scale: number = 1; // scale calculation in game is _really_ small

	constructor(scene: GameScene, name: string, offset: number, height: number, scale: number = 3000, flipX: boolean = false, collides: boolean = false) {
		this.scene = scene;
		this.sprite = scene.add.sprite(-999, -999, name).setOrigin(0.5, 1).setVisible(false);
		this.offset = offset;
		this.height = height;
		this.collides = collides;
		this.scale = scale;

		this.sprite.flipX = flipX;
	}

	public update(x: number = 0, y: number = 0, scale: number = 1, segmentClip: number = 0) {
		this.sprite.setPosition(x, y + this.height);
		this.sprite.setScale(this.scale * scale);
		this.sprite.setDepth(10 + scale); // draw order

		if (!this.sprite.visible) {
			this.sprite.setVisible(true);
		}

		// calculate clipping behind hills
		if (y > segmentClip) {
			const clipped = (y - segmentClip) / this.sprite.scaleY;
			const cropY = this.sprite.height - clipped;
			this.sprite.setCrop(0, 0, this.sprite.width, cropY);
		} else {
			this.sprite.setCrop();
		}
	}

	public destroy(): void {
		this.sprite.destroy();
		this.scene = undefined;
	}
}
