import { BaseScene } from './BaseScene';

export class BootScene extends BaseScene {
	constructor(key: string, options: any) {
		super('BootScene');
	}

	public preload(): void {
		this.load.bitmapFont('retro', './assets/cosmicavenger.png', './assets/cosmicavenger.xml');
	}

	public create(): void {
		this.scene.start('LoadScene', {});
	}
}
