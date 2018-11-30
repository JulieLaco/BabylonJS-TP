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
        private sheeps: number = 0;
        private canvas;

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
            this.camera.upperBetaLimit = 1.5;
            this.camera.lowerBetaLimit = 1.5;
            this.camera.lowerAlphaLimit = -0.20;
            this.camera.upperAlphaLimit = 0.20;

            this.canvas.addEventListener("click", (evt) => {
                this.canvas['requestPointerLock'] =
                    this.canvas['requestPointerLock'] ||
                    this.canvas.msRequestPointerLock ||
                    this.canvas.mozRequestPointerLock ||
                    this.canvas.webkitRequestPointerLock;
                if (this.canvas['requestPointerLock']) {
                    this.canvas['requestPointerLock']();
                }
            }, false);

            const pointerlockchange = function (event) {
                    this.controlEnabled = (
                        document.mozPointerLockElement ===
                        this.canvas 
                        || document.webkitPointerLockElement === this.canvas 
                        || document.msPointerLockElement === this.canvas
                        || document['requestPointerLock'] === this.canvas);

                    if (!this.controlEnabled) {
                        this.camera.detachControl(this.canvas);
                    } else {
                        this.camera.attachControl(this.canvas);
                    }
                };

            document.addEventListener("pointerlockchange",
                pointerlockchange,
                false);
            document.addEventListener("mspointerlockchange",
                pointerlockchange,
                false);
            document.addEventListener("mozpointerlockchange",
                pointerlockchange,
                false);
            document.addEventListener("webkitpointerlockchange",
                pointerlockchange,
                false);

            this.light = new PointLight('light', new Vector3(15, 15, 15), this.scene);

            this.ground = <GroundMesh>Mesh.CreateGround('ground', 1000, 100, 32, this.scene);
            this.ground.physicsImpostor = new PhysicsImpostor(this.ground, PhysicsImpostor.BoxImpostor, {
                mass: 0,
            });

            this.engine.runRenderLoop(() => {
                while (this.sheeps < this.maxSheep) {
                    this.createSheep();
                    this.sheeps++;
                }
            })

            this.createSkybox();
        }

        public createSheep() {
            let assetsManager = new BABYLON.AssetsManager(this.scene);
            let meshTask = assetsManager.addMeshTask("sheep", "", "./assets/", "mouton-bab.babylon");
            meshTask.onSuccess = (task) => {
                const sheep = task.loadedMeshes[0];
                sheep.position = new Vector3(0, 3, 0);

                const material = new StandardMaterial('sheepColor', this.scene);
                sheep.material = material;
                material.diffuseColor = new Color3(1, 0, 0);
                //material.emissiveColor = new Color3(1, 0, 0);

                this.engine.runRenderLoop(() => {
                    this.sheepMove(sheep);
                })
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
                BABYLON.ActionManager.OnPickTrigger,
                function (event) {
                    console.log("test");
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
