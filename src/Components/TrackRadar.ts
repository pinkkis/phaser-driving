import { RaceUiScene } from '../scenes/RaceUiScene';
import { gameSettings } from '../config/GameSettings';

export class TrackRadar {
	public scene: RaceUiScene;
	public radarText: Phaser.GameObjects.BitmapText;
	public graphics: Phaser.GameObjects.Graphics;

	private x: number;
	private y: number;

	constructor(scene: RaceUiScene, x: number, y: number) {
		this.scene = scene;
		this.x = x;
		this.y = y;

		this.scene.add.rectangle(x, y, 33, 143, 0xffffff, .75).setOrigin(0, 0);
		this.scene.add.grid(x + 2, y + 2, 30, 140, 30 / gameSettings.lanes, 140 / 5, 0x333333, 0.8).setOrigin(0, 0);
	}

	public update(): void {
		//
	}

	public destroy(): void {
		//
	}
}
