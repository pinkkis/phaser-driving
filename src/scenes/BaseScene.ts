import { PoisonVialGame } from '../game';
import { PasuunaPlugin } from '@pinkkis/phaser-plugin-pasuuna';

export class BaseScene extends Phaser.Scene {
	public game: PoisonVialGame;
	public pasuuna: PasuunaPlugin;

	constructor(key: string, options?: any) {
		super(key);
	}

	public setTimerEvent(timeMin: number, timeMax: number, callback: () => {}, params?: any[]): Phaser.Time.TimerEvent {
		return this.time.delayedCall(Phaser.Math.Between(timeMin, timeMax), callback, params || [], this);
	}
}
