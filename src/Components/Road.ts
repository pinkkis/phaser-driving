import { TrackSegment } from './TrackSegment';
import { gameSettings } from '../config/GameSettings';
import { Util } from './Util';
import { SEGMENT } from './SegmentType';

export class Road {
	public segments: TrackSegment[];
	public trackLength: number;

	constructor() {
		this.segments = [];
		this.trackLength = 0;
	}

	public addRoadSegment(curve: number, y: number): void {
		this.segments.push(new TrackSegment(this.segments.length, curve, y, this.getLastSegmentYPos()));
	}

	public addStraight(num: number = SEGMENT.LENGTH.MEDIUM): void {
		this.addRoad(num, num, num, 0, 0);
	}

	public addCurve(num: number = SEGMENT.LENGTH.MEDIUM, curve: number = SEGMENT.CURVE.MEDIUM, height: number = 0): void {
		this.addRoad(num, num, num, curve, height);
	}

	public addHill(num: number = SEGMENT.LENGTH.MEDIUM, height: number = 0): void {
		this.addRoad(num, num, num, 0, height);
	}

	public addRoad(enter: number, hold: number, leave: number, curve: number, y: number): void {
		const startY = this.getLastSegmentYPos();
		const endY = startY + Util.toInt(y, 0) * gameSettings.segmentLength;
		const totalLength = enter + hold + leave;

		for (let n = 0; n < enter; n++) {
			this.addRoadSegment(Util.easeIn(0, curve, n / enter), Util.easeInOut(startY, endY, n / totalLength));
		}

		for (let n = 0; n < hold; n++) {
			this.addRoadSegment(curve, Util.easeInOut(startY, endY, (enter + n) / totalLength));
		}

		for (let n = 0; n < leave; n++) {
			this.addRoadSegment(Util.easeInOut(curve, 0, n / leave), Util.easeInOut(startY, endY, (enter + hold + n) / totalLength));
		}
	}

	public getLastSegmentYPos(): number {
		const lastSegment = this.getLastSegment();
		return lastSegment ? lastSegment.p2.world.y : 0;
	}

	public getLastSegment(): TrackSegment {
		return this.segments.length > 0 ? this.segments[this.segments.length - 1] : null;
	}

	public findSegmentByZ(z: number): TrackSegment {
		const index = Math.floor(z / gameSettings.segmentLength) % this.segments.length;
		return this.segments[index];
	}

	public resetRoad(): void {
		this.segments = [];

		this.addStraight(SEGMENT.LENGTH.SHORT / 2);
		this.addCurve(SEGMENT.LENGTH.MEDIUM, SEGMENT.CURVE.MEDIUM, SEGMENT.HILL.LOW);
		this.addHill(SEGMENT.LENGTH.LONG, SEGMENT.HILL.MEDIUM);
		this.addCurve(SEGMENT.LENGTH.LONG, SEGMENT.CURVE.MEDIUM);
		this.addHill(SEGMENT.LENGTH.SHORT, -SEGMENT.HILL.MEDIUM);
		this.addHill(SEGMENT.LENGTH.MEDIUM, SEGMENT.HILL.HIGH);
		this.addStraight();
		this.addCurve(SEGMENT.LENGTH.SHORT, SEGMENT.CURVE.MEDIUM, SEGMENT.HILL.LOW);
		this.addHill(SEGMENT.LENGTH.LONG, -SEGMENT.HILL.HIGH);
		this.addCurve(SEGMENT.LENGTH.LONG, -SEGMENT.CURVE.MEDIUM);
		this.addCurve(SEGMENT.LENGTH.LONG, SEGMENT.CURVE.MEDIUM);
		this.addStraight();
		this.addCurve(SEGMENT.LENGTH.LONG, -SEGMENT.CURVE.EASY);
		this.addHill(SEGMENT.LENGTH.LONG, -SEGMENT.HILL.MEDIUM);
		this.addCurve(SEGMENT.LENGTH.LONG, SEGMENT.CURVE.MEDIUM, -SEGMENT.HILL.LOW);
		this.addRoad(200, 200, 200, SEGMENT.CURVE.NONE, Math.round(-this.getLastSegmentYPos() / gameSettings.segmentLength));

		this.trackLength = this.segments.length * gameSettings.segmentLength;
	}

}
