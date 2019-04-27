import { RaceUiScene } from '../scenes/RaceUiScene';
import { Util } from './Util';
import { gameSettings } from '../config/GameSettings';

export class SpeedGauge {
	public scene: RaceUiScene;
	public speedText: Phaser.GameObjects.BitmapText;
	public graphics: Phaser.GameObjects.Graphics;

	private x: number;
	private y: number;
	private radius: number;
	private speedValue: number = 0;

	constructor(scene: RaceUiScene, x: number, y: number, radius: number) {
		this.scene = scene;
		this.x = x;
		this.y = y;
		this.radius = radius;

		this.graphics = this.scene.add.graphics();
		this.speedText = this.scene.add.bitmapText(x + 35, y - 15, 'numbers', this.speedValue.toString(), 48).setOrigin(1, 0.5);
		this.scene.add.bitmapText(x - 58, y - 8, 'impact', `kmh`, 12).setTint(0xffff00);

		this.update();
	}

	public get speed(): number {
		return this.speedValue;
	}

	public set speed(value: number) {
		this.speedValue = value;
		this.update();
	}

	public update(): void {
		this.graphics.clear();
		this.drawGauge();
		this.speedText.setText(this.speedValue.toString());
	}

	public destroy(): void {
		//
	}

	// -------------

	private drawGauge(): void {
		const speedColor = Phaser.Display.Color.HSVToRGB(0.3 - this.speedValue / 600, 1, 1) as Phaser.Display.Color;

		this.graphics.lineStyle(17, 0x555555, 1)
			.beginPath()
			.arc(this.x, this.y, this.radius, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(315), false)
			.strokePath();

		this.graphics.lineStyle(12, speedColor.color)
			.beginPath()
			.arc(this.x, this.y, this.radius, Phaser.Math.DegToRad(183), Phaser.Math.DegToRad(183) + this.speedToAngle(), false)
			.strokePath();
	}

	private speedToAngle(): number {
		const speedPercentage = this.speedValue > 0 ? (this.speedValue * 1000) / gameSettings.maxSpeed : 0;
		const angle = Util.interpolate(0, 130, speedPercentage * .01);
		return Phaser.Math.DegToRad(angle);
	}
}
