import { BaseScene } from './BaseScene';

export class LoadScene extends BaseScene {
	constructor(key: string, options: any) {
		super('LoadScene');
	}

	public preload(): void {
		const progress = this.add.graphics();

		this.load.on('progress', (value: number) => {
			progress.clear();
			progress.fillStyle(0xffffff, 1);
			progress.fillRect(
				0,
				this.scale.gameSize.height / 2,
				this.scale.gameSize.width * value,
				60,
			);
		});

		this.load.on('complete', () => {
			progress.destroy();
		});

		this.load.image('clouds', './assets/clouds.png');
		this.load.image('mountain', './assets/mountain.png');
		this.load.image('boulder', './assets/boulder.png');
		this.load.image('tree', './assets/tree.png');
		this.load.binary('playercar', './assets/3d/car.glb');
	}

	public create(): void {
		this.scene.start('GameScene', {});
	}

}
