class GameSettings {
	public roadWidth = 2200;
	public roadWidthClamp = 3;
	public segmentLength = 200;
	public rumbleLength = 6;
	public lanes = 3;
	public fieldOfView = 110;
	public cameraHeight = 2000;
	public cameraDepth = 1 / Math.tan( (this.fieldOfView / 2) * Math.PI / 180 );
	public projectYCompensation = 30;
	public drawDistance = 500;
	public fogDensity = 5;
	public maxSpeed = this.segmentLength * 8;
	public accel = this.maxSpeed / 50;
	public decel = -this.maxSpeed / 70;
	public breaking = -this.maxSpeed / 20;
	public offRoadDecel = -this.maxSpeed / 10;
	public offRoadLimit = this.maxSpeed / 4;
	public centrifugal = 0.175;
	public steerCompensation = 0.5;
	public maxTurn = 1;
	public turnResetMultiplier = 0.1;
	public cameraAngleResetMultiplier = 0.07;
	public totalCars = 30;
}

export const gameSettings = new GameSettings();
