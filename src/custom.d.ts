declare module "worker-loader!*" {
	export default class WebpackWorker extends Worker {
		constructor();
	}
}

declare var require: any;

interface Window {
	env?: any;
}

declare module '@pinkkis/phaser-plugin-pasuuna' {
	export class PasuunaPlugin extends Phaser.Plugins.BasePlugin {
		loadSongFromCache(key: string, autoplay: boolean): void;
	}
}
