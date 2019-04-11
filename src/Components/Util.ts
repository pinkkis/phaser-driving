export class Util {
	public static rumbleWidth(projectedRoadWidth: number, lanes: number): number {
		return projectedRoadWidth / Math.max(6, 2 * lanes);
	}

	public static laneMarkerWidth(projectedRoadWidth: number, lanes: number): number {
		return projectedRoadWidth / Math.max(32, 8 * lanes);
	}

	public static easeIn(a: number, b: number, percent: number): number {
		return a + (b - a) * Math.pow(percent, 2);
	}

	public static easeOut(a: number, b: number, percent: number): number {
		return a + (b - a) * (1 - Math.pow(1 - percent, 2));
	}

	public static easeInOut(a: number, b: number, percent: number): number {
		return a + (b - a) * ((-Math.cos(percent * Math.PI) / 2) + 0.5);
	}

	public static percentRemaining(n: number, total: number): number {
		return (n % total) / total;
	}

	public static toInt(obj: any, def: any): number {
		if (obj !== null) {
			const x = parseInt(obj, 10);
			if (!isNaN(x)) {
				return x;
			}
		}

		return Util.toInt(def, 0);
	}
}
