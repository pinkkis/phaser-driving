export const Colors = {
	ROAD_LIGHT: new Phaser.Display.Color(127, 127, 127, 1),
	ROAD_DARK: new Phaser.Display.Color(123, 123, 123, 1),
	GRASS_LIGHT: new Phaser.Display.Color(63, 200, 63, 1),
	GRASS_DARK: new Phaser.Display.Color(63, 170, 63, 1),
	LANE_MARKER: new Phaser.Display.Color(220, 220, 220, 1),
	RUMBLE_LIGHT: new Phaser.Display.Color(200, 200, 200, 1),
	RUMBLE_DARK: new Phaser.Display.Color(177, 64, 64, 1),
	SKY: new Phaser.Display.Color(127, 127, 255, 1),
};

export const DarkColors = {
	ROAD: Colors.ROAD_DARK.color,
	GRASS: Colors.GRASS_DARK.color,
	RUMBLE: Colors.RUMBLE_LIGHT.color,
};

export const LightColors = {
	ROAD: Colors.ROAD_LIGHT.color,
	GRASS: Colors.GRASS_LIGHT.color,
	RUMBLE: Colors.RUMBLE_DARK.color,
	LANE: Colors.LANE_MARKER.color,
};
