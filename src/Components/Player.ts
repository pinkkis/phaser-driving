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
	public smokeEmitterLeft: Phaser.GameObjects.Particles.ParticleEmitter;
	public smokeEmitterRight: Phaser.GameObjects.Particles.ParticleEmitter;

	public turn: number;
	public pitch: number;
	public speed: number;
	public trackPosition: number;
	public accelerating: boolean = false;
	public collisionRadius: number = 20;
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
		const particleSettings = {
			lifespan: 500,
			frequency: 66,
			frame: 0,
			blendMode: 'NORMAL',
			gravityY: -100,
			speed: 0,
			rotate: { onEmit: () => Math.random() * 359 },
			scale: { start: 0.3, end: 2 },
		};

		this.smokeEmitterLeft = this.smokeParticles.createEmitter(particleSettings);
		this.smokeEmitterRight = this.smokeParticles.createEmitter(particleSettings);

		this.p3d = new Phaser3D(this.scene, { fov: 35, x: 0, y: 7, z: -20, antialias: false });
		this.p3d.view.setDepth(20);
		this.p3d.addGLTFModel(modelKey);

		this.p3d.camera.lookAt(0, 5.1, 0);

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
			this.p3d.camera.rotation.z = Math.PI + Phaser.Math.DegToRad(this.scene.cameraAngle);

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
		const particleSpeed = -this.turn * 100;
		const particleAngle = this.turn < 0 ? { min: -30, max: 0 } : { min: 180, max: 210 };
		const halfWidth = this.scene.scale.gameSize.width / 2;
		const particleX = halfWidth + (-this.turn * 20);

		this.smokeEmitterLeft.setPosition(particleX - 13, this.scene.scale.gameSize.height - 5 - this.pitch * 15 - (this.turn > 0 ? this.turn * 7 : 0));
		this.smokeEmitterRight.setPosition(particleX + 13, this.scene.scale.gameSize.height - 5 - this.pitch * 15 + (this.turn < 0 ? this.turn * 7 : 0));

		this.smokeEmitterLeft.setSpeed(particleSpeed);
		this.smokeEmitterRight.setSpeed(particleSpeed);

		this.smokeEmitterLeft.setAngle(particleAngle);
		this.smokeEmitterRight.setAngle(particleAngle);

		if (this.isOnGravel) {
			this.smokeEmitterLeft.setFrame(1);
			this.smokeEmitterRight.setFrame(1);
		} else {
			this.smokeEmitterLeft.setFrame(0);
			this.smokeEmitterRight.setFrame(0);
		}

		if (this.speed > 300 && Math.abs(this.turn) > 0.66 && !this.smokeEmitterLeft.on) {
			this.smokeEmitterLeft.on = true;
			this.smokeEmitterRight.on = true;
		} else if (this.speed > 100 && this.isOnGravel) {
			this.smokeEmitterLeft.on = true;
			this.smokeEmitterRight.on = true;
		} else if (this.speed < 500 && this.accelerating) {
			this.smokeEmitterLeft.on = true;
			this.smokeEmitterRight.on = true;
		} else {
			this.smokeEmitterLeft.stop();
			this.smokeEmitterRight.stop();
		}
	}
}
