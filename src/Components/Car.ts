import { GameScene } from '../scenes/GameScene';
import { TrackSegment } from './TrackSegment';
import { gameSettings } from '../config/GameSettings';
import { Util } from './Util';

export class Car {
	public scene: GameScene;
	public sprite: Phaser.GameObjects.Sprite;
	public offset: number = 0;
	public speed: number = 0;
	public trackPosition: number = 0;
	public percent: number = 0;
	public scale: number = 1500;

	constructor(scene: GameScene, offset: number, trackPosition: number, sprite: string, speed: number) {
		this.scene = scene;
		this.offset = offset;
		this.speed = speed;
		this.trackPosition = trackPosition;
		this.sprite = this.scene.add.sprite(-999, -999, sprite, 0).setOrigin(0.5, 1);
	}

	public get isOnGravel(): boolean {
		return Math.abs(this.offset) > 1;
	}

	public update(delta: number, carSegment: TrackSegment, playerSegment: TrackSegment, playerOffset: number): void {
		this.updateOffset(delta, carSegment, playerSegment);
		this.updateAngleFrame(carSegment, playerSegment, playerOffset);
	}

	public draw(x: number = 0, y: number = 0, scale: number = 1, segmentClip: number = 0) {
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

	public updateAngleFrame(carSegment: TrackSegment, playerSegment: TrackSegment, playerOffset: number): void {
		const roadDistance = Math.abs(carSegment.index - playerSegment.index);
		const offsetDistance = Math.abs(playerOffset - this.offset);
		const isLeft = playerOffset > this.offset;

		if (roadDistance < 20 && offsetDistance > 0.3) {
			this.sprite.setFrame(1);
			this.sprite.flipX = !isLeft;
		} else {
			this.sprite.setFrame(0);
		}
	}

	public updateOffset(delta: number, carSegment: TrackSegment, playerSegment: TrackSegment): void {
		// const lookahead = 20;

		// car not visible, don't do ai behaviour
		if (carSegment.index - playerSegment.index > gameSettings.drawDistance) {
			return;
		}

		// steer towards center of track if outside it
		if (Math.abs(this.offset) > 0.9) {
			this.offset = Util.interpolate(this.offset, 0, delta);
		}

	}

	public destroy(): void {
		this.sprite.destroy();
	}
}
