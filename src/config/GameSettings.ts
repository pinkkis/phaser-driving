class GameSettings {
	public roadWidth = 2000;
	public segmentLength = 200;
	public rumbleLength = 3;
	public lanes = 3;
	public fieldOfView = 100;
	public cameraHeight = 1000;
	public cameraDepth = 1 / Math.tan( (this.fieldOfView / 2) * Math.PI / 180 );
	public drawDistance = 500;
	public fogDensity = 5;
	public maxSpeed = this.segmentLength * 9;
	public accel = this.maxSpeed / 50;
	public decel = -this.maxSpeed / 70;
	public breaking = -this.maxSpeed / 20;
	public offRoadDecel = -this.maxSpeed / 2;
	public offRoadLimit = this.maxSpeed / 4;
}

export const gameSettings = new GameSettings();
