// phaser game config
export const gameConfig: GameConfig = {
	type: Phaser.AUTO,
	scale: {
		parent: 'game-container',
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: 640,
		height: 360,
	},
	render: {
		pixelArt: true,
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true,
		},
	},
	plugins: {
		global: [] as any[],
	},
};
