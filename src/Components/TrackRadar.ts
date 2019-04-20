import { RaceUiScene } from '../scenes/RaceUiScene';
import { gameSettings } from '../config/GameSettings';
import { Util } from './Util';
import { RadarCar } from './RadarCar';

const centerX = 17;
const playerY = 130;

export class TrackRadar {
	public scene: RaceUiScene;
	// public radarText: Phaser.GameObjects.BitmapText;
	public graphics: Phaser.GameObjects.Graphics;
	public container: Phaser.GameObjects.Container;
	public bg: Phaser.GameObjects.Rectangle;
	public grid: Phaser.GameObjects.Grid;

	public player: Phaser.GameObjects.Rectangle;
	public cars: Set<RadarCar>;

	private x: number;
	private y: number;


	constructor(scene: RaceUiScene, x: number, y: number) {
		this.scene = scene;
		this.x = x;
		this.y = y;

		this.cars = new Set<RadarCar>();

		this.container = this.scene.add.container(this.x, this.y);

		this.bg = this.scene.add.rectangle(0, 0, 33, 163, 0xffffff, .75).setOrigin(0, 0);
		this.grid = this.scene.add.grid(2, 2, 30, 160, 30 / gameSettings.lanes, 160 / 5, 0x333333, 0.8).setOrigin(0, 0);

		this.graphics = this.scene.add.graphics();

		this.player = this.scene.add.rectangle(centerX, playerY, 3, 5, 0xffff00);

		this.container.add([this.bg, this.grid, this.player, this.graphics]);
	}

	public update(): void {
		this.graphics.clear();
	}

	public destroy(): void {
		//
	}

	public updatePlayerX(value: number): void {
		const interpolatedValue = Util.interpolate(2, 17, value + 1);
		this.player.x = Phaser.Math.Clamp(interpolatedValue, 4, 30);
	}

	public drawCar(offset: number, distance: number) {
		const interpolatedOffset = Util.interpolate(2, 17, offset + 1);
		const x = Phaser.Math.Clamp(interpolatedOffset, 4, 30);

		const interpolatedDistance = Util.interpolate(0, 156, 1 / (distance * 0.0007));
		const y = Phaser.Math.Clamp(interpolatedDistance, 2, 156);

		this.graphics.fillStyle(0xff0000).fillRect(x, y, 3, 5);

		// debugger;
	}
}
