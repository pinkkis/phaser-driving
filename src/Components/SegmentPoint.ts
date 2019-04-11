export interface IScreenPoint {
	x: number;
	y: number;
	w: number;
	scale: number;
}

export class SegmentPoint {
	public world: Phaser.Math.Vector3;
	public camera: Phaser.Math.Vector3;
	public screen: IScreenPoint;

	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.world = new Phaser.Math.Vector3(x, y, z);
		this.camera = new Phaser.Math.Vector3(0, 0, 0);
		this.screen = { x: 0, y: 0, w: 0, scale: 0 };
	}
}
