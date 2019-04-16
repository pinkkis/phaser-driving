import { GameScene } from '../scenes/GameScene';

export class Prop {
	public scene: GameScene;
	public sprite: Phaser.GameObjects.Sprite;
	public offset: number;
	public collides: boolean;
	public scale: number = 1; // scale calculation in came is _really_ small

	constructor(scene: GameScene, name: string, offset: number, collides: boolean) {
		this.scene = scene;
		this.sprite = scene.add.sprite(-999, -999, name).setOrigin(0.5, 1).setVisible(false);
		this.offset = offset;
		this.collides = collides;
		this.scale = name === 'tree' ? 5000 : 2000;
	}

	public update(x: number = 0, y: number = 0, scale: number = 1, segmentClip: number = 0) {
		this.sprite.setPosition(x, y);
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
