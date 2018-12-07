var BABYLON;
(function (BABYLON) {
    var Main = /** @class */ (function () {
        /**
         * Constructor
         */
        function Main() {
            var _this = this;
            this.maxSheep = 5;
            this.sheepNumber = 0;
            this.sheeps = [];
            this.engine = new BABYLON.Engine(document.getElementById('renderCanvas'));
            this.canvas = this.engine.getRenderingCanvas();
            this.scene = new BABYLON.Scene(this.engine);
            this.scene.enablePhysics(new BABYLON.Vector3(0, -50.81, 0), new BABYLON.CannonJSPlugin());
            this.camera = new BABYLON.ArcRotateCamera('camera', 0, 1.5, 1, new BABYLON.Vector3(200, 10, 0), this.scene);
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
            this.light = new BABYLON.PointLight('light', new BABYLON.Vector3(15, 15, 15), this.scene);
            this.ground = BABYLON.Mesh.CreateGround('ground', 1000, 100, 32, this.scene);
            this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0,
            });
            this.engine.runRenderLoop(function () {
                while (_this.sheepNumber <= _this.maxSheep) {
                    console.log("1");
                    _this.createSheep();
                }
            });
            this.createSkybox();
        }
        Main.prototype.createSound = function () {
            this.sheepDieSound = new BABYLON.Sound('Music', './assets/Joueur du Grenier - Excalibur 2555 A.D - Playstation - Le cri du scorpion.mp3', this.scene);
        };
        Main.prototype.createVisor = function () {
            var ui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('ui');
            var target = new BABYLON.GUI.Image('target', './assets/crosshairsr.png');
            target.width = '10%';
            ui.addControl(target);
            target.autoScale = true;
        };
        Main.prototype.createSheep = function () {
            var _this = this;
            var assetsManager = new BABYLON.AssetsManager(this.scene);
            var meshTask = assetsManager.addMeshTask("sheep", "", "./assets/", "mouton-bab.babylon");
            this.sheepNumber++;
            meshTask.onSuccess = function (task) {
                var sheep = task.loadedMeshes[0];
                // mettre une boucle pour cloner mes mesh
                var mesh1 = BABYLON.Mesh.CreateSphere('sphere', 8, 2, _this.scene);
                mesh1.position = new BABYLON.Vector3(15, 1, 15);
                sheep = task.loadedMeshes[0].clone('sheepMultiClonage', sheep);
                sheep.parent = mesh1;
                var line = Math.floor(Math.random() * 3);
                switch (line) {
                    case 0:
                        {
                            sheep.position = new BABYLON.Vector3(0, 2, -25);
                            break;
                        }
                    case 1:
                        {
                            sheep.position = new BABYLON.Vector3(0, 2, 0);
                            break;
                        }
                    case 2:
                        {
                            sheep.position = new BABYLON.Vector3(0, 2, 25);
                            break;
                        }
                    default:
                        {
                            sheep.position = new BABYLON.Vector3(0, 2, 0);
                            break;
                        }
                }
                var material = new BABYLON.StandardMaterial('sheepColor', _this.scene);
                sheep.material = material;
                material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                material.emissiveColor = new BABYLON.Color3(1, 0, 0);
                _this.engine.runRenderLoop(function () {
                    _this.sheepMove(sheep);
                });
                _this.sheepExploded(sheep);
                _this.createSound();
            };
            meshTask.onError = function (task, message, exception) {
                console.log(message, exception);
            };
            assetsManager.load();
        };
        Main.prototype.sheepMove = function (sheep) {
            sheep.position.x += 0.1;
        };
        Main.prototype.sheepExploded = function (sheep) {
            var _this = this;
            sheep.actionManager = new BABYLON.ActionManager(this.scene);
            sheep.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, function () {
                sheep.dispose(true, true);
                _this.sheepNumber--;
                _this.sheepDieSound.play();
            }));
        };
        Main.prototype.createSkybox = function () {
            this.skybox = BABYLON.Mesh.CreateBox('skybox', 1000, this.scene, false, BABYLON.Mesh.BACKSIDE);
            var skyboxMaterial = new BABYLON.StandardMaterial('skyboxMaterial', this.scene);
            skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('assets/TropicalSunnyDay', this.scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            skyboxMaterial.disableLighting = true;
            this.skybox.infiniteDistance = true;
            this.skybox.material = skyboxMaterial;
        };
        /**
         * Setup physics for the given cube
         */
        Main.prototype.setupPhysics = function (cube) {
            cube.physicsImpostor = new BABYLON.PhysicsImpostor(cube, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 1
            });
        };
        /**
         * Runs the engine to render the scene into the canvas
         */
        Main.prototype.run = function () {
            var _this = this;
            this.engine.runRenderLoop(function () {
                _this.scene.render();
            });
        };
        return Main;
    }());
    BABYLON.Main = Main;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    var OceanMaterial = /** @class */ (function () {
        /**
         * Constructor
         * @param scene the scene where to add the material
         */
        function OceanMaterial(scene) {
            var _this = this;
            this.time = 0;
            this.material = new BABYLON.ShaderMaterial('ocean', scene, {
                vertexElement: './shaders/ocean',
                fragmentElement: './shaders/ocean',
            }, {
                attributes: ['position', 'uv'],
                uniforms: ['worldViewProjection', 'time'],
                samplers: ['diffuseSampler1', 'diffuseSampler2'],
                defines: [],
            });
            // Textures
            this.diffuseSampler1 = new BABYLON.Texture('./assets/diffuse.png', scene);
            this.diffuseSampler2 = this.diffuseSampler1.clone(); // new Texture('./assets/diffuse.png', scene);
            // Bind
            this.material.onBind = function (mesh) {
                _this.time += scene.getEngine().getDeltaTime() * 0.003;
                _this.material.setFloat('time', _this.time);
                _this.material.setTexture('diffuseSampler1', _this.diffuseSampler1);
                _this.material.setTexture('diffuseSampler2', _this.diffuseSampler2);
            };
        }
        return OceanMaterial;
    }());
    BABYLON.OceanMaterial = OceanMaterial;
})(BABYLON || (BABYLON = {}));
//# sourceMappingURL=index.js.map