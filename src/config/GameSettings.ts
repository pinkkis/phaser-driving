class GameSettings {
	public roadWidth = 2000;
	public segmentLength = 200;
	public rumbleLength = 3;
	public lanes = 4;
	public fieldOfView = 100;
	public cameraHeight = 1000;
	public cameraDepth = 1 / Math.tan((this.fieldOfView / 2) * Math.PI / 180);
	public drawDistance = 300;
	public fogDensity = 5;
	public maxSpeed = this.segmentLength / (1 / 15);
	public accel = this.maxSpeed / 5;
	public breaking = -this.maxSpeed;
	public decel = -this.maxSpeed / 5;
	public offRoadDecel = -this.maxSpeed / 2;
	public offRoadLimit = this.maxSpeed / 4;
}

export const gameSettings = new GameSettings();
