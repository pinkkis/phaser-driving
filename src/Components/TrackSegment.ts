import { SegmentPoint } from './SegmentPoint';
import { gameSettings } from '../config/GameSettings';
import { Colors } from './Colors';

export class TrackSegment {
	public index: number;
	public p1: SegmentPoint;
	public p2: SegmentPoint;
	public color: number;
	public looped: boolean = false;
	public fog: number = 0;

	constructor(index: number) {
		this.index = index;
		this.p1 = new SegmentPoint(0, 0, index * gameSettings.segmentLength);
		this.p2 = new SegmentPoint(0, 0, (index + 1) * gameSettings.segmentLength);
		this.color = Math.floor( (index / gameSettings.rumbleLength) % 2 ? Colors.ROAD_DARK.color : Colors.ROAD_LIGHT.color );
	}
}
