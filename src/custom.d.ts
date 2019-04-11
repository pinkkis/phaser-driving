declare module "worker-loader!*" {
	export default class WebpackWorker extends Worker {
		constructor();
	}
}

declare var require: any;

interface Window {
	env?: any;
}
