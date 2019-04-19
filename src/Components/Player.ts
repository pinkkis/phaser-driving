import { GameScene } from '../scenes/GameScene';
import { Phaser3D } from '../libs/Phaser3D';
import { gameSettings } from '../config/GameSettings';
import { Util } from './Util';

const HALFPI = Math.PI / 2;

export class Player {
	public position: Phaser.Math.Vector3;
	public sprite: Phaser.GameObjects.Rectangle;
	public scene: GameScene;
	public p3d: Phaser3D;
	public model: any;
	public smokeParticles: Phaser.GameObjects.Particles.ParticleEmitterManager;
	public smokeEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

	public turn: number;
	public pitch: number;
	public speed: number;
	public trackPosition: number;

	private turnVector: Phaser.Math.Vector3;

	constructor(scene: GameScene, x: number, y: number, z: number, modelKey: string) {
		this.position = new Phaser.Math.Vector3(x, y, z);
		this.scene = scene;
		this.turn = 0;
		this.pitch = 0;
		this.speed = 0;
		this.trackPosition = 0;
		this.turnVector = new Phaser.Math.Vector3(0, 0, 0);

		this.smokeParticles = this.scene.add.particles('particles').setDepth(21);
		this.smokeEmitter = this.smokeParticles.createEmitter({
			lifespan: 500,
			frequency: 50,
			frame: 0,
			blendMode: 'NORMAL',
			gravityY: -100,
			speed: 0,
			rotate: { onEmit: () => Math.random() * 359 },
			scale: { start: 0.3, end: 2 },
		});

		this.p3d = new Phaser3D(this.scene, {fov: 45, x: 0, y: 5, z: -16, antialias: false });
		this.p3d.view.setDepth(20);
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

	public get isOnGravel(): boolean {
		return Math.abs(this.x) > 1;
	}

	public update(delta: number, dx: number) {
		this.position.x += (this.turn * 0.08) * (this.speed / gameSettings.maxSpeed);

		if (this.model) {
			this.turnVector.y = HALFPI + -this.turn;
			this.turnVector.x = Phaser.Math.Clamp(this.pitch, -0.3, 0.3);
			this.model.rotation.setFromVector3(this.turnVector);

			if (this.pitch > 0) {
				this.model.position.y = Util.interpolate(this.model.position.y, -this.pitch * 3, 0.33);
			}

			if (this.speed > 20) {
				this.model.position.y = Util.interpolate(this.model.position.y + Phaser.Math.Between(-1, 1) * (this.isOnGravel ? 0.1 : 0.01), 0, 0.2);
			}

			this.updateParticles();
		}
	}

	public updateParticles() {
		this.smokeEmitter.setPosition(this.scene.scale.gameSize.width / 2 + (-this.turn * 10),
									  this.scene.scale.gameSize.height - 5 - this.pitch * 15);
		this.smokeEmitter.setSpeed(-this.turn * 100);
		this.smokeEmitter.setAngle(this.turn < 0 ? 0 : 180);

		if (this.isOnGravel) {
			this.smokeEmitter.setFrame(1);
		} else {
			this.smokeEmitter.setFrame(0);
		}

		if (this.speed > 300 && Math.abs(this.turn) > 0.66 && !this.smokeEmitter.on) {
			this.smokeEmitter.on = true;
		} else if (this.speed > 100 && this.isOnGravel) {
			this.smokeEmitter.on = true;
		} else {
			this.smokeEmitter.stop();
		}
	}
}
