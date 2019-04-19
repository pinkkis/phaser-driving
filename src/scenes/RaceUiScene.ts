import { BaseScene } from './BaseScene';

export class RaceUiScene extends BaseScene {
	public timerText: Phaser.GameObjects.BitmapText;

	constructor(key: string, options: any) {
		super('RaceUiScene');
	}

	public create(): void {
		this.timerText = this.add.bitmapText(5, 5, 'retro', 'race timer', 8);
	}

	public update(): void {
		//
	}
}
