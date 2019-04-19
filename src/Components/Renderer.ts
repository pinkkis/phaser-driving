import { SegmentPoint } from './SegmentPoint';
import { Util } from './Util';
import { gameSettings } from '../config/GameSettings';
import { GameScene } from '../scenes/GameScene';

export class Renderer {
	public static project(sp: SegmentPoint, cameraX: number, cameraY: number, cameraZ: number, cameraDepth: number, width: number, height: number, roadWidth: number) {
		sp.camera.x = (sp.world.x || 0) - cameraX;
		sp.camera.y = (sp.world.y || 0) - cameraY;
		sp.camera.z = (sp.world.z || 0) - cameraZ;
		sp.screen.scale = cameraDepth / sp.camera.z;
		sp.screen.x = Math.round((width / 2) + (sp.screen.scale * sp.camera.x * width / 2));
		sp.screen.y = Math.round((height / 2) - (sp.screen.scale * sp.camera.y * height / 2));
		sp.screen.w = Math.round((sp.screen.scale * roadWidth * width / 2));
	}

	public static drawPolygon(g: Phaser.GameObjects.Graphics, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, color: number) {
		g.save().fillStyle(color).beginPath()
			.moveTo(x1, y1).lineTo(x2, y2).lineTo(x3, y3).lineTo(x4, y4)
			.closePath().fillPath().restore();
	}

	public static drawSegment(ctx: Phaser.GameObjects.Graphics, width: number, lanes: number, x1: number, y1: number, w1: number, x2: number, y2: number, w2: number, colors: any) {
		const r1 = Util.rumbleWidth(w1, lanes);
		const r2 = Util.rumbleWidth(w2, lanes);
		const l1 = Util.laneMarkerWidth(w1, lanes);
		const l2 = Util.laneMarkerWidth(w1, lanes);
		const h = y1 - y2;

		ctx.fillStyle(colors.GRASS);
		ctx.fillRect(-10, y2, width, h);

		Renderer.drawPolygon(ctx, x1 - w1 - r1, y1, x1 - w1, y1, x2 - w2, y2, x2 - w2 - r2, y2, colors.RUMBLE);
		Renderer.drawPolygon(ctx, x1 + w1 + r1, y1, x1 + w1, y1, x2 + w2, y2, x2 + w2 + r2, y2, colors.RUMBLE);
		Renderer.drawPolygon(ctx, x1 - w1, y1, x1 + w1, y1, x2 + w2, y2, x2 - w2, y2, colors.ROAD);

		const lanew1 = w1 * 2 / lanes;
		const lanew2 = w2 * 2 / lanes;
		let lanex1 = x1 - w1 + lanew1;
		let lanex2 = x2 - w2 + lanew2;

		if (colors.LANE) {
			for (let lane = 1; lane < lanes; lanex1 += lanew1, lanex2 += lanew2, lane++) {
				Renderer.drawPolygon(ctx, lanex1 - l1 / 2, y1, lanex1 + l1 / 2, y1, lanex2 + l2 / 2, y2, lanex2 - l2 / 2, y2, colors.LANE);
			}
		}
	}

	// -------------

	public scene: GameScene;
	public roadGraphics: Phaser.GameObjects.Graphics;

	constructor(scene: GameScene, depth: number = 0) {
		this.scene = scene;
		this.roadGraphics = this.scene.add.graphics().setDepth(depth);
	}

	public update(time: number, delta: number): void {
		this.roadGraphics.clear();
		this.drawRoad();
	}

	public drawRoad(): void {
		const gameWidth = this.scene.scale.gameSize.width + 20;
		const gameHeight = this.scene.scale.gameSize.height + 20;

		const baseSegment = this.scene.road.findSegmentByZ(this.scene.player.trackPosition);
		const basePercent = Util.percentRemaining(this.scene.player.trackPosition, gameSettings.segmentLength);

		let maxY = gameHeight; // used for clipping things behind a hill
		let roadCenterX = 0;
		let deltaX = -(baseSegment.curve * basePercent);

		// draw road front to back
		for (let n = 0; n < gameSettings.drawDistance; n++) {
			const segmentIndex = (baseSegment.index + n) % this.scene.road.segments.length;
			const segment = this.scene.road.segments[segmentIndex];

			segment.clip = maxY;
			segment.looped = segment.index < baseSegment.index;

			Renderer.project(segment.p1, this.scene.player.x * gameSettings.roadWidth - roadCenterX, this.scene.player.y + gameSettings.cameraHeight,
				this.scene.player.trackPosition - (segment.looped ? this.scene.road.trackLength : 0), gameSettings.cameraDepth,
				gameWidth, gameHeight, gameSettings.roadWidth);

			Renderer.project(segment.p2, this.scene.player.x * gameSettings.roadWidth - roadCenterX - deltaX, this.scene.player.y + gameSettings.cameraHeight,
				this.scene.player.trackPosition - (segment.looped ? this.scene.road.trackLength : 0), gameSettings.cameraDepth,
				gameWidth, gameHeight, gameSettings.roadWidth);

			roadCenterX = roadCenterX + deltaX;
			deltaX = deltaX + segment.curve;

			if (segment.p1.camera.z <= gameSettings.cameraDepth || segment.p2.screen.y >= maxY || segment.p2.screen.y >= segment.p1.screen.y) {
				continue;
			}

			Renderer.drawSegment(this.roadGraphics, gameWidth, gameSettings.lanes,
				segment.p1.screen.x - 10, segment.p1.screen.y, segment.p1.screen.w,
				segment.p2.screen.x - 10, segment.p2.screen.y, segment.p2.screen.w,
				segment.colors);

			maxY = segment.p2.screen.y;
		}

		// draw props back to front
		for (let n = gameSettings.drawDistance - 1; n > 0; n--) {
			const segmentIndex = (baseSegment.index + n) % this.scene.road.segments.length;
			const segment = this.scene.road.segments[segmentIndex];

			for (const prop of segment.props) {
				const scale = segment.p1.screen.scale;
				const x = segment.p1.screen.x - 10 + (scale * prop.offset * gameSettings.roadWidth * gameWidth / 2);
				const y = segment.p1.screen.y;

				prop.update(x, y, scale, segment.clip);
			}
		}
	}
}
