import { SegmentPoint } from './SegmentPoint';
import { gameSettings } from '../config/GameSettings';
import { DarkColors, LightColors } from './Colors';
import { Prop } from './Prop';
import { Car } from './Car';

export class TrackSegment {
	public index: number;
	public p1: SegmentPoint;
	public p2: SegmentPoint;
	public looped: boolean = false;
	public fog: number = 0;
	public curve: number;
	public colors: any;
	public props: Set<Prop>;
	public cars: Set<Car>;
	public clip: number;

	constructor(z: number, curve: number, y: number, lastY: number) {
		this.index = z;
		this.p1 = new SegmentPoint(0, lastY, z * gameSettings.segmentLength);
		this.p2 = new SegmentPoint(0, y, (z + 1) * gameSettings.segmentLength);
		this.colors = Math.floor(z / gameSettings.rumbleLength) % 2 ? DarkColors : LightColors;
		this.curve = curve;
		this.clip = 0;

		this.props = new Set<Prop>();
		this.cars = new Set<any>();
	}
}
