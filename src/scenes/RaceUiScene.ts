import { BaseScene } from './BaseScene';
import { SpeedGauge } from '../Components/SpeedGauge';
import { TrackRadar } from '../Components/TrackRadar';

export class RaceUiScene extends BaseScene {
	public timerText: Phaser.GameObjects.BitmapText;
	public timeLargeText: Phaser.GameObjects.BitmapText;
	public timeSmallText: Phaser.GameObjects.BitmapText;
	public speedGauge: SpeedGauge;
	public trackRadar: TrackRadar;

	public timer: Phaser.Tweens.Tween;

	constructor(key: string, options: any) {
		super('RaceUiScene');
	}

	public create(): void {
		this.timerText = this.add.bitmapText(this.scale.gameSize.width / 2 + 14, 5, 'retro', 'time', 8).setOrigin(0, 0);
		this.timeLargeText = this.add.bitmapText(this.scale.gameSize.width / 2 + 30, 15, 'retro', '000', 16).setOrigin(1, 0).setTint(0xff0000);
		this.timeSmallText = this.add.bitmapText(this.scale.gameSize.width / 2 + 30, 16, 'retro', '000', 8).setOrigin(0, 0).setTint(0xff0000);

		this.speedGauge = new SpeedGauge(this, 60, 60, 50);
		this.trackRadar = new TrackRadar(this, this.scale.gameSize.width - 40, 30);

		this.timer = this.tweens.addCounter({
			from: 180,
			to: 0,
			duration: 180000,
		});

		this.setupEvents();
	}

	public update(): void {
		const timerValue = this.timer.getValue().toFixed(2).split('.');
		this.timeLargeText.setText(timerValue[0]);
		this.timeSmallText.setText(timerValue[1]);
	}

	public destroy(): void {
		this.registry.events.off('changedata');
	}

	private setupEvents(): void {
		this.registry.events.on('changedata', (parent: any, key: string, data: any) => {
			switch (key) {
				case 'speed':
					this.speedGauge.speed = data;
					break;
				default:
					console.warn('unknown registry change');
			}
		}, this);
	}


}
