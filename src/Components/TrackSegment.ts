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

	constructor(index: number, curve: number) {
		this.index = index;
		this.p1 = new SegmentPoint(0, 0, index * gameSettings.segmentLength);
		this.p2 = new SegmentPoint(0, 0, (index + 1) * gameSettings.segmentLength);
		this.colors = Math.floor(index / gameSettings.rumbleLength) % 2 ? DarkColors : LightColors;
		this.curve = curve;
	}
}
