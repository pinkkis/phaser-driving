import { BaseScene } from './BaseScene';

export class BootScene extends BaseScene {
	constructor(key: string, options: any) {
		super('BootScene');
	}

	public preload(): void {
		this.load.bitmapFont('retro', './assets/fonts/cosmicavenger.png', './assets/fonts/cosmicavenger.xml');
	}

	public create(): void {
		this.registry.set('speed', 0);
		this.registry.set('racetime', 0);
		this.registry.set('trackposition', 0);
		this.registry.set('raceposition', 0);
		this.registry.set('playerx', 0);

		this.scene.start('LoadScene', {});
	}
}
