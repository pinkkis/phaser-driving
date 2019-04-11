import { SegmentPoint } from './SegmentPoint';
import { gameSettings } from '../config/GameSettings';
import { DarkColors, LightColors } from './Colors';

export class TrackSegment {
	public index: number;
	public p1: SegmentPoint;
	public p2: SegmentPoint;
	public looped: boolean = false;
	public fog: number = 0;
	public curve: number;
	public colors: any;

	constructor(z: number, curve: number, y: number, lastY: number) {
		this.index = z;
		this.p1 = new SegmentPoint(0, lastY, z * gameSettings.segmentLength);
		this.p2 = new SegmentPoint(0, y, (z + 1) * gameSettings.segmentLength);
		this.colors = Math.floor(z / gameSettings.rumbleLength) % 2 ? DarkColors : LightColors;
		this.curve = curve;
	}
}
