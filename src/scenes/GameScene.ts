import { BaseScene } from './BaseScene';
import { Input } from 'phaser';
import { Colors } from '../Components/Colors';
import { gameSettings } from '../config/GameSettings';
import { Util } from '../Components/Util';
import { Player } from '../Components/Player';
import { Road } from '../Components/Road';
import { Renderer } from '../Components/Renderer';
import { TrackSegment } from '../Components/TrackSegment';

export class GameScene extends BaseScene {
	public position: number;
	public player: Player;
	public road: Road;
	public renderer: Renderer;

	public debugText: Phaser.GameObjects.BitmapText;
	public sky: Phaser.GameObjects.Rectangle;
	public clouds1: Phaser.GameObjects.TileSprite;
	public clouds2: Phaser.GameObjects.TileSprite;
	public clouds3: Phaser.GameObjects.TileSprite;
	public mountains: Phaser.GameObjects.TileSprite;

	public cursors: Input.Keyboard.CursorKeys;

	constructor(key: string, options: any) {
		super('GameScene');
	}

	public create(): void {
		const gameWidth = this.scale.gameSize.width;
		const gameHeight = this.scale.gameSize.height;

		this.cursors = this.input.keyboard.createCursorKeys();

		this.road = new Road();

		this.sky = this.add.rectangle(-10, -10, gameWidth + 10, gameHeight + 10, Colors.SKY.color).setOrigin(0).setZ(0);
		this.clouds2 = this.add.tileSprite(0, 10, gameWidth, 64, 'clouds').setOrigin(0).setZ(3).setTileScale(0.5, 1);
		this.clouds3 = this.add.tileSprite(0, 20, gameWidth, 64, 'clouds').setOrigin(0).setZ(4).setTileScale(1, 1.5);
		this.mountains = this.add.tileSprite(0, gameHeight / 2 + 50, gameWidth, 149, 'mountain').setOrigin(0, 1).setZ(5);
		this.clouds1 = this.add.tileSprite(0, 0, gameWidth, 64, 'clouds').setOrigin(0).setZ(2).setTileScale(1, 1);

		this.renderer = new Renderer(this);
		this.player = new Player(this, 0, gameHeight - 5, gameSettings.cameraHeight * gameSettings.cameraDepth, 'playercar');

		this.debugText = this.add.bitmapText(5, 5, 'retro', '', 16).setTint(0xff0000);

		this.road.resetRoad();
	}

	public update(time: number, delta: number): void {
		const playerSegment = this.road.findSegmentByZ(this.player.trackPosition + this.player.z);
		const playerPercent = Util.percentRemaining(this.player.trackPosition + this.player.z, gameSettings.segmentLength);
		const speedMultiplier = this.player.speed / gameSettings.maxSpeed;
		const dx = this.player.speed <= 0 ? 0 : delta * 0.01 * speedMultiplier;

		this.handleInput(delta, playerSegment);

		this.player.y = Util.interpolate(playerSegment.p1.world.y, playerSegment.p2.world.y, playerPercent);
		this.player.x = this.player.x - (dx * speedMultiplier * playerSegment.curve * gameSettings.centrifugal);

		this.player.speed = Phaser.Math.Clamp(this.player.speed, 0, gameSettings.maxSpeed);
		this.player.x = Phaser.Math.Clamp(this.player.x, -gameSettings.roadWidthClamp, gameSettings.roadWidthClamp);
		this.player.turn = Phaser.Math.Clamp(this.player.turn, -gameSettings.maxTurn, gameSettings.maxTurn);
		this.player.trackPosition = Util.increase(this.player.trackPosition, (delta * 0.01) * this.player.speed, this.road.trackLength);

		this.player.pitch = (playerSegment.p1.world.y - playerSegment.p2.world.y) * 0.002;

		// update player turn
		this.player.update(delta, dx);

		// update bg position
		this.updateBg(dx * playerSegment.curve);

		// offroad
		if (Math.abs(this.player.x) > 1.1 && this.player.speed > gameSettings.offRoadLimit) {
			this.player.isOnGravel = true;
		} else {
			this.player.isOnGravel = false;
		}

		if (this.player.isOnGravel) {
			this.player.speed = Util.accelerate(this.player.speed, gameSettings.offRoadDecel, delta * 0.01);
		}

		// draw road
		this.renderer.update(time, delta);

		this.debugText.setText(`speed: ${this.player.speed.toFixed()}
		position: ${this.player.trackPosition.toFixed(2)}
		curve: ${playerSegment.curve.toFixed(2)}
		player y: ${this.player.y.toFixed(2)}
		player x: ${this.player.x.toFixed(2)}
		turn: ${this.player.turn.toFixed(2)}
		pitch: ${(this.player.pitch).toFixed(2)}
		speedX: ${(this.player.speed / gameSettings.maxSpeed).toFixed(3)}
		dx: ${dx.toFixed(3)}`);
	}

	// private
	private updateBg(offset: number): void {
		this.clouds1.tilePositionX += 0.1 + offset * this.clouds1.z;
		this.clouds2.tilePositionX += 0.1 + offset * this.clouds2.z;
		this.clouds3.tilePositionX += 0.1 + offset * this.clouds3.z;
		this.mountains.tilePositionX += offset * this.mountains.z;
	}

	private handleInput(delta: number, playerSegment: TrackSegment) {
		const dlt = delta * 0.01;

		if (this.cursors.up.isDown) {
			this.player.speed = Util.accelerate(this.player.speed, gameSettings.accel, dlt);
		} else if (this.cursors.down.isDown) {
			this.player.speed = Util.accelerate(this.player.speed, gameSettings.breaking, dlt);
		} else {
			this.player.speed = Util.accelerate(this.player.speed, gameSettings.decel, dlt);
		}

		if (this.cursors.left.isDown) {
			this.player.turn -= dlt * (Math.abs(playerSegment.curve) > 0.1 ? 0.5 : 0.25);
		} else if (this.cursors.right.isDown) {
			this.player.turn += dlt * (Math.abs(playerSegment.curve) > 0.1 ? 0.5 : 0.25);
		} else {
			this.player.turn = Math.abs(this.player.turn) < 0.01 ? 0 : Util.interpolate(this.player.turn, 0, gameSettings.turnResetMultiplier);
		}
	}
}
