import { GameScene } from '../scenes/GameScene';
import { Phaser3D } from '../libs/Phaser3D';
import { gameSettings } from '../config/GameSettings';

const HALFPI = Math.PI / 2;

export class Player {
	public position: Phaser.Math.Vector3;
	public sprite: Phaser.GameObjects.Rectangle;
	public scene: GameScene | Phaser.Scene;
	public p3d: Phaser3D;
	public model: any;

	public turn: number;
	public speed: number;
	public trackPosition: number;

	constructor(scene: GameScene, x: number, y: number, z: number, modelKey: string) {
		this.position = new Phaser.Math.Vector3(x, y, z);
		this.scene = scene;
		this.turn = 0;
		this.speed = 0;
		this.trackPosition = 0;

		this.p3d = new Phaser3D(this.scene, {fov: 45, x: 0, y: 5, z: -16, antialias: false });
		this.p3d.addGLTFModel(modelKey);

		this.p3d.camera.lookAt(0, 5, 0);

		this.p3d.add.hemisphereLight({ skyColor: 0xefefff, groundColor: 0x111111, intensity: 2 });
		this.p3d.on('loadgltf', (gltf: any, model: any) => {
			model.rotateY(HALFPI);
			model.position.set(0, 0, 0);
			model.scale.set(1, 1, 1);
			this.model = model;
		});
	}

	public get x(): number { return this.position.x; }
	public set x(x: number) {
		this.position.x = x;
	}

	public get y(): number { return this.position.y; }
	public set y(y: number) {
		this.position.y = y;
	}

	public get z(): number { return this.position.z; }
	public set z(z: number) {
		this.position.z = z;
	}

	public update(delta: number, dx: number) {
		if (this.model) {
			this.model.setRotationFromAxisAngle(new Phaser.Math.Vector3(0, 1, 0), HALFPI + -this.turn);
		}

		this.position.x += (this.turn * 0.08) * (this.speed / gameSettings.maxSpeed);
	}
}
