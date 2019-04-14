import { BaseScene } from './BaseScene';
import { Input } from 'phaser';
import { Colors } from '../Components/Colors';
import { TrackSegment } from '../Components/TrackSegment';
import { gameSettings } from '../config/GameSettings';
import { SegmentPoint } from '../Components/SegmentPoint';
import { Util } from '../Components/Util';
import { Player } from '../Components/Player';
import { ROAD } from '../Components/Road';

export class GameScene extends BaseScene {
	public segments: TrackSegment[];
	public trackLength: number;

	public position: number;
	public speed: number;
	public player: Player;

	public debugText: Phaser.GameObjects.BitmapText;
	public roadGraphics: Phaser.GameObjects.Graphics;

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
		this.segments = [];
		this.trackLength = 0;
		this.position = 0;
		this.speed = 0;

		this.cursors = this.input.keyboard.createCursorKeys();

		this.sky = this.add.rectangle(-10, -10, this.scale.gameSize.width + 10, this.scale.gameSize.height + 10, Colors.SKY.color).setOrigin(0).setZ(0);
		this.clouds1 = this.add.tileSprite(0, 10, this.scale.gameSize.width, 64, 'clouds').setOrigin(0).setZ(2).setTileScale(1, 1);
		this.clouds2 = this.add.tileSprite(0, 30, this.scale.gameSize.width, 64, 'clouds').setOrigin(0).setZ(3).setTileScale(0.5, 1);
		this.clouds3 = this.add.tileSprite(0, 50, this.scale.gameSize.width, 64, 'clouds').setOrigin(0).setZ(4).setTileScale(1, 1.5);
		this.mountains = this.add.tileSprite(0, this.scale.gameSize.height / 2 + 20, this.scale.gameSize.width, 149, 'mountain').setOrigin(0, 1).setZ(5);

		this.roadGraphics = this.add.graphics();
		this.player = new Player(this, 0, this.scale.gameSize.height - 5, gameSettings.cameraHeight * gameSettings.cameraDepth);

		this.debugText = this.add.bitmapText(5, 5, 'retro', '', 16);

		this.resetRoad();
	}

	public update(time: number, delta: number): void {
		// empty
		this.roadGraphics.clear();
		const playerSegment = this.findSegmentByZ(this.position + this.player.z);
		const playerPercent = Util.percentRemaining(this.position + this.player.z, gameSettings.segmentLength);
		const speedMultiplier = this.speed / gameSettings.maxSpeed;
		const dx = this.speed <= 0 ? 0 : delta * 0.01 * speedMultiplier;

		this.handleInput(delta, dx);

		this.player.y = Util.interpolate(playerSegment.p1.world.y, playerSegment.p2.world.y, playerPercent);
		this.player.x = this.player.x - (dx * speedMultiplier * playerSegment.curve * gameSettings.centrifugal);

		this.speed = Phaser.Math.Clamp(this.speed, 0, gameSettings.maxSpeed);
		this.player.x = Phaser.Math.Clamp(this.player.x, -gameSettings.roadWidthClamp, gameSettings.roadWidthClamp);

		// update bg position
		this.updateBg(dx * playerSegment.curve);

		// TODO: offroad

		// track position
		this.position = Util.increase(this.position, (delta * 0.01) * this.speed, this.trackLength);

		this.drawRoad();

		this.debugText.setText(`speed: ${this.speed.toFixed()}
		position: ${this.position.toFixed(2)}
		curve: ${playerSegment.curve.toFixed(2)}
		player y: ${this.player.y.toFixed(2)}
		speedX: ${(this.speed / gameSettings.maxSpeed).toFixed(3)}
		dx: ${dx.toFixed(3)}
	`);
	}

	// private
	private updateBg(offset: number): void {
		this.clouds1.tilePositionX += 0.1 + offset * this.clouds1.z;
		this.clouds2.tilePositionX += 0.1 + offset * this.clouds2.z;
		this.clouds3.tilePositionX += 0.1 + offset * this.clouds3.z;
		this.mountains.tilePositionX += offset * this.mountains.z;
	}

	private project(sp: SegmentPoint, cameraX: number, cameraY: number, cameraZ: number, cameraDepth: number, width: number, height: number, roadWidth: number) {
		sp.camera.x = (sp.world.x || 0) - cameraX;
		sp.camera.y = (sp.world.y || 0) - cameraY;
		sp.camera.z = (sp.world.z || 0) - cameraZ;
		sp.screen.scale = cameraDepth / sp.camera.z;
		sp.screen.x = Math.round( (width / 2) + (sp.screen.scale * sp.camera.x * width / 2) );
		sp.screen.y = Math.round( (height / 2) - (sp.screen.scale * sp.camera.y * height / 2) );
		sp.screen.w = Math.round( (sp.screen.scale * roadWidth * width / 2) );
	}

	private drawPolygon(g: Phaser.GameObjects.Graphics, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, color: number) {
		g.save()
			.fillStyle(color)
			.beginPath()
			.moveTo(x1, y1)
			.lineTo(x2, y2)
			.lineTo(x3, y3)
			.lineTo(x4, y4)
			.closePath()
			.fillPath()
			.restore();
	}

	private drawSegment(width: number, lanes: number, x1: number, y1: number, w1: number, x2: number, y2: number, w2: number, fog: number, colors: any) {
		const r1 = Util.rumbleWidth(w1, lanes);
		const r2 = Util.rumbleWidth(w2, lanes);
		const l1 = Util.laneMarkerWidth(w1, lanes);
		const l2 = Util.laneMarkerWidth(w1, lanes);

		this.roadGraphics.fillStyle(colors.GRASS);
		const h = y1 - y2;
		this.roadGraphics.fillRect(0, y2, width, h);

		this.drawPolygon(this.roadGraphics, x1 - w1 - r1, y1, x1 - w1, y1, x2 - w2, y2, x2 - w2 - r2, y2, colors.RUMBLE);
		this.drawPolygon(this.roadGraphics, x1 + w1 + r1, y1, x1 + w1, y1, x2 + w2, y2, x2 + w2 + r2, y2, colors.RUMBLE);
		this.drawPolygon(this.roadGraphics, x1 - w1, y1, x1 + w1, y1, x2 + w2, y2, x2 - w2, y2, colors.ROAD);

		const lanew1 = w1 * 2 / lanes;
		const lanew2 = w2 * 2 / lanes;
		let lanex1 = x1 - w1 + lanew1;
		let lanex2 = x2 - w2 + lanew2;

		if (colors.LANE) {
			for (let lane = 1; lane < lanes; lanex1 += lanew1, lanex2 += lanew2, lane++) {
				this.drawPolygon(this.roadGraphics, lanex1 - l1 / 2, y1, lanex1 + l1 / 2, y1, lanex2 + l2 / 2, y2, lanex2 - l2 / 2, y2, colors.LANE);
			}
		}

		// Render.fog(ctx, 0, y1, width, y2 - y1, fog);
	}

	private drawRoad(): void {
		const gameWidth = this.scale.gameSize.width;
		const gameHeight = this.scale.gameSize.height;

		const baseSegment = this.findSegmentByZ(this.position);
		const basePercent = Util.percentRemaining(this.position, gameSettings.segmentLength);

		let maxY = gameHeight;
		let x = 0;
		let dx = - (baseSegment.curve * basePercent);

		for (let n = 0; n < gameSettings.drawDistance; n++) {
			const segmentIndex = (baseSegment.index + n) % this.segments.length;
			const segment = this.segments[segmentIndex];

			segment.looped = segment.index < baseSegment.index;

			this.project(segment.p1, this.player.x * gameSettings.roadWidth - x, this.player.y + gameSettings.cameraHeight,
				this.position - (segment.looped ? this.trackLength : 0), gameSettings.cameraDepth,
				gameWidth, gameHeight, gameSettings.roadWidth);

			this.project(segment.p2, this.player.x * gameSettings.roadWidth - x - dx, this.player.y + gameSettings.cameraHeight,
				this.position - (segment.looped ? this.trackLength : 0), gameSettings.cameraDepth,
				gameWidth, gameHeight, gameSettings.roadWidth);

			x = x + dx;
			dx = dx + segment.curve;

			if (segment.p1.camera.z <= gameSettings.cameraDepth || segment.p2.screen.y >= maxY || segment.p2.screen.y >= segment.p1.screen.y) {
				continue;
			}

			this.drawSegment(gameWidth, gameSettings.lanes,
				segment.p1.screen.x,
				segment.p1.screen.y,
				segment.p1.screen.w,
				segment.p2.screen.x,
				segment.p2.screen.y,
				segment.p2.screen.w,
				segment.fog,
				segment.colors,
			);

			maxY = segment.p2.screen.y;
		}
	}

	private addRoadSegment(curve: number, y: number): void {
		this.segments.push( new TrackSegment(this.segments.length, curve, y, this.getLastSegmentYPos()) );
	}

	private addStraight(num: number = ROAD.LENGTH.MEDIUM): void {
		this.addRoad(num, num, num, 0, 0);
	}

	private addCurve(num: number = ROAD.LENGTH.MEDIUM, curve: number = ROAD.CURVE.MEDIUM, height: number = 0): void {
		this.addRoad(num, num, num, curve, height);
	}

	private addHill(num: number = ROAD.LENGTH.MEDIUM, height: number = 0): void {
		this.addRoad(num, num, num, 0, height);
	}

	private addRoad(enter: number, hold: number, leave: number, curve: number, y: number): void {
		const startY = this.getLastSegmentYPos();
		const endY = startY + Util.toInt(y, 0) * gameSettings.segmentLength;
		const totalLength = enter + hold + leave;

		for (let n = 0; n < enter; n++) {
			this.addRoadSegment(Util.easeIn(0, curve, n / enter), Util.easeInOut(startY, endY, n / totalLength));
		}

		for (let n = 0; n < hold; n++) {
			this.addRoadSegment(curve, Util.easeInOut(startY, endY, (enter + n) / totalLength));
		}

		for (let n = 0; n < leave; n++) {
			this.addRoadSegment(Util.easeInOut(curve, 0, n / leave), Util.easeInOut(startY, endY, (enter + hold + n) / totalLength));
		}
	}

	private getLastSegmentYPos(): number {
		const lastSegment = this.getLastSegment();
		return lastSegment ? lastSegment.p2.world.y : 0;
	}

	private getLastSegment(): TrackSegment {
		return this.segments.length > 0 ? this.segments[this.segments.length - 1] : null;
	}

	private findSegmentByZ(z: number): TrackSegment {
		const index = Math.floor(z / gameSettings.segmentLength) % this.segments.length;
		return this.segments[index];
	}

	private resetRoad(): void {
		this.segments = [];

		this.addStraight(ROAD.LENGTH.SHORT / 4);
		this.addCurve(ROAD.LENGTH.MEDIUM, ROAD.CURVE.MEDIUM, ROAD.HILL.LOW);
		this.addHill(ROAD.LENGTH.LONG, ROAD.HILL.MEDIUM);
		this.addCurve(ROAD.LENGTH.LONG, ROAD.CURVE.MEDIUM);
		this.addHill(ROAD.LENGTH.SHORT, -ROAD.HILL.MEDIUM);
		this.addHill(ROAD.LENGTH.MEDIUM, ROAD.HILL.MEDIUM);
		this.addStraight();
		this.addCurve(ROAD.LENGTH.LONG, -ROAD.CURVE.MEDIUM);
		this.addCurve(ROAD.LENGTH.LONG, ROAD.CURVE.MEDIUM);
		this.addStraight();
		this.addCurve(ROAD.LENGTH.LONG, -ROAD.CURVE.EASY);

		this.addRoad(100, 100, 100, -ROAD.CURVE.EASY, this.getLastSegmentYPos() / gameSettings.segmentLength);

		this.trackLength = this.segments.length * gameSettings.segmentLength;
	}

	private handleInput(delta: number, dx: number) {
		if (this.cursors.up.isDown) {
			this.speed = Util.accelerate(this.speed, gameSettings.accel, delta * 0.01);
		} else if (this.cursors.down.isDown) {
			this.speed = Util.accelerate(this.speed, gameSettings.breaking, delta * 0.01);
		} else {
			this.speed = Util.accelerate(this.speed, gameSettings.decel, delta * 0.01);
		}

		const speedMultiplier = this.speed / gameSettings.maxSpeed;

		if (this.cursors.left.isDown) {
			this.player.x -= dx * gameSettings.steerCompensation;
		}

		if (this.cursors.right.isDown) {
			this.player.x += dx * gameSettings.steerCompensation;
		}
	}
}
