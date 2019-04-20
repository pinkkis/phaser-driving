import { GameScene } from '../scenes/GameScene';
import { TrackSegment } from './TrackSegment';
import { gameSettings } from '../config/GameSettings';
import { Util } from './Util';
import { Road } from './Road';

export class Car {
	public scene: GameScene;
	public road: Road;
	public sprite: Phaser.GameObjects.Sprite;
	public offset: number = 0;
	public speed: number = 0;
	public trackPosition: number = 0;
	public percent: number = 0;
	public scale: number = 1500;

	constructor(scene: GameScene, road: Road, offset: number, trackPosition: number, sprite: string, speed: number) {
		this.scene = scene;
		this.road = road;
		this.offset = offset;
		this.speed = speed;
		this.trackPosition = trackPosition;
		this.sprite = this.scene.add.sprite(-999, 999, sprite, 0).setOrigin(0.5, 1);
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
		// segments ahead to see if there's somethign to avoid
		const lookahead = 50;

		const player = this.scene.player;

		// car not visible, don't do ai behaviour
		if (carSegment.index - playerSegment.index > gameSettings.drawDistance) {
			return;
		}

		for (let i = 0; i < lookahead; i++) {
			const segment = this.road.segments[ (carSegment.index + i) % this.road.segments.length];

			if (segment === playerSegment && this.speed > player.speed && Util.overlapPlayer(player, this)) {
				if (player.x < this.offset) {
					this.offset = Util.interpolate(this.offset, 1, delta * 0.1);
				} else {
					this.offset = Util.interpolate(this.offset, -1, delta * 0.1);
				}
			}

			if (segment.cars.size) {
				segment.cars.forEach((car: Car) => {
					if (car === this) { return; }

					if (this.speed > car.speed && Util.overlapSprite(car.sprite, this.sprite)) {
						if (car.offset < this.offset) {
							this.offset = Util.interpolate(this.offset, 1, delta * 0.1);
						} else {
							this.offset = Util.interpolate(this.offset, -1, delta * 0.1);
						}
					}
				});
			}

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
