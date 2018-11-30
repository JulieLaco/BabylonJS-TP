module BABYLON {
    export class Main {
        // Public members
        public engine: Engine;
        public scene: Scene;
        public camera: ArcRotateCamera;
        public light: PointLight;
        public ground: GroundMesh;
        private skybox: Mesh;
        private maxSheep: number = 5;
        private sheepNumber: number = 0;
        private sheeps: Mesh[] = [];
        private canvas;

        private sheepDieSound: Sound;

        /**
         * Constructor
         */
        constructor() {
            this.engine = new Engine(<HTMLCanvasElement>document.getElementById('renderCanvas'));
            this.canvas = this.engine.getRenderingCanvas();

            this.scene = new Scene(this.engine);
            this.scene.enablePhysics(new Vector3(0, -50.81, 0), new CannonJSPlugin());

            this.camera = new ArcRotateCamera('camera', 0, 1.5, 1, new Vector3(200, 10, 0), this.scene);
            this.camera.inputs.clear();
            this.camera.inputs.add(new BABYLON.ArcRotateCameraPointersInput());
            this.camera.attachControl(this.engine.getRenderingCanvas());
            // this.camera.upperBetaLimit = 1.5;
            // this.camera.lowerBetaLimit = 1.5;
            // this.camera.lowerAlphaLimit = -0.20;
            // this.camera.upperAlphaLimit = 0.20;

            // this.canvas.addEventListener("click", (evt) => {
            //     this.canvas['requestPointerLock'] = this.canvas['requestPointerLock']
            //         || this.canvas.msRequestPointerLock
            //         || this.canvas.mozRequestPointerLock
            //         || this.canvas.webkitRequestPointerLock;
            //     if (this.canvas['requestPointerLock']) {
            //         this.canvas['requestPointerLock']();
            //     }
            // }, false);

            // const pointerlockchange = function (event) {
            //     this.controlEnabled = (
            //         document.mozPointerLockElement === this.canvas
            //         || document.webkitPointerLockElement === this.canvas
            //         || document.msPointerLockElement === this.canvas
            //         || document['requestPointerLock'] === this.canvas);

            //     if (!this.controlEnabled) {
            //         this.camera.detachControl(this.canvas);
            //     } else {
            //         this.camera.attachControl(this.canvas);
            //     }
            // };

            // document.addEventListener("pointerlockchange", pointerlockchange, false);
            // document.addEventListener("mspointerlockchange", pointerlockchange, false);
            // document.addEventListener("mozpointerlockchange", pointerlockchange, false);
            // document.addEventListener("webkitpointerlockchange", pointerlockchange, false);

            //this.createVisor();

            this.light = new PointLight('light', new Vector3(15, 15, 15), this.scene);

            this.ground = <GroundMesh>Mesh.CreateGround('ground', 1000, 100, 32, this.scene);
            this.ground.physicsImpostor = new PhysicsImpostor(this.ground, PhysicsImpostor.BoxImpostor, {
                mass: 0,
            });

            this.engine.runRenderLoop(() => {
                while (this.sheepNumber <= this.maxSheep) {
                    console.log("1");
                    this.createSheep();
                }
            })

            this.createSkybox();
        }

        public createSound(){
            this.sheepDieSound = new BABYLON.Sound('Music', './assets/Joueur du Grenier - Excalibur 2555 A.D - Playstation - Le cri du scorpion.mp3', this.scene);
        }

        public createVisor() {
            const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI('ui');
            const target = new GUI.Image('target', './assets/crosshairsr.png');
            target.width = '10%';
            ui.addControl(target);
            target.autoScale = true;
        }

        public createSheep() {
            let assetsManager = new BABYLON.AssetsManager(this.scene);
            let meshTask = assetsManager.addMeshTask("sheep", "", "./assets/", "mouton-bab.babylon");         
            this.sheepNumber++;
            meshTask.onSuccess = (task) => {
                const sheep = task.loadedMeshes[0];
                
                // sheep.clone;

                let line = Math.floor(Math.random() * 3);
                switch (line) {
                    case 0:
                    {
                        sheep.position = new Vector3(0, 2, -25);
                        break;
                    }
                    case 1:
                    {
                        sheep.position = new Vector3(0, 2, 0);
                        break;
                    }
                    case 2:
                    {
                        sheep.position = new Vector3(0, 2, 25);
                        break;
                    }
                    default:
                    {
                        sheep.position = new Vector3(0, 2, 0);
                        break;
                    }
                }

                const material = new StandardMaterial('sheepColor', this.scene);
                sheep.material = material;
                material.diffuseColor = new Color3(1, 0, 0);
                material.emissiveColor = new Color3(1, 0, 0);

                this.engine.runRenderLoop(() => {
                    this.sheepMove(sheep);
                })
                
                this.sheepExploded(sheep);
                this.createSound();
            }

            meshTask.onError = function (task, message, exception) {
                console.log(message, exception);
            }

            assetsManager.load();
        }

        sheepMove(sheep: AbstractMesh): void {
            sheep.position.x += 0.1;
        }

        sheepExploded(sheep: AbstractMesh): void {
            sheep.actionManager = new BABYLON.ActionManager(this.scene);
            sheep.actionManager.registerAction(new ExecuteCodeAction(
                ActionManager.OnLeftPickTrigger,
                () => {
                    sheep.dispose(true, true);
                    this.sheepNumber--;
                    this.sheepDieSound.play();
                }
            ))
        }

        createSkybox() {
            this.skybox = BABYLON.Mesh.CreateBox('skybox', 1000, this.scene, false, BABYLON.Mesh.BACKSIDE);
            let skyboxMaterial = new BABYLON.StandardMaterial('skyboxMaterial', this.scene);
            skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('assets/TropicalSunnyDay', this.scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            skyboxMaterial.disableLighting = true;
            this.skybox.infiniteDistance = true;
            this.skybox.material = skyboxMaterial;
        }


        /**
         * Setup physics for the given cube
         */
        public setupPhysics(cube: Mesh): void {
            cube.physicsImpostor = new PhysicsImpostor(cube, PhysicsImpostor.BoxImpostor, {
                mass: 1
            });
        }

        /**
         * Runs the engine to render the scene into the canvas
         */
        public run() {
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
        }
    }
}
