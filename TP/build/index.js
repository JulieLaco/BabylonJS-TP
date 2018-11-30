var BABYLON;
(function (BABYLON) {
    var Main = /** @class */ (function () {
        /**
         * Constructor
         */
        function Main() {
            var _this = this;
            this.maxSheep = 5;
            this.sheeps = 0;
            this.engine = new BABYLON.Engine(document.getElementById('renderCanvas'));
            this.canvas = this.engine.getRenderingCanvas();
            this.scene = new BABYLON.Scene(this.engine);
            this.scene.enablePhysics(new BABYLON.Vector3(0, -50.81, 0), new BABYLON.CannonJSPlugin());
            this.camera = new BABYLON.ArcRotateCamera('camera', 0, 1.5, 1, new BABYLON.Vector3(200, 10, 0), this.scene);
            this.camera.inputs.clear();
            this.camera.inputs.add(new BABYLON.ArcRotateCameraPointersInput());
            this.camera.attachControl(this.engine.getRenderingCanvas());
            this.camera.upperBetaLimit = 1.6;
            this.camera.lowerBetaLimit = 1.3;
            this.camera.lowerAlphaLimit = -0.40;
            this.camera.upperAlphaLimit = 0.40;
            this.canvas.addEventListener("click", function (evt) {
                _this.canvas['requestPointerLock'] = _this.canvas['requestPointerLock']
                    || _this.canvas.msRequestPointerLock
                    || _this.canvas.mozRequestPointerLock
                    || _this.canvas.webkitRequestPointerLock;
                if (_this.canvas['requestPointerLock']) {
                    _this.canvas['requestPointerLock']();
                }
            }, false);
            var pointerlockchange = function (event) {
                this.controlEnabled = (document.mozPointerLockElement === this.canvas
                    || document.webkitPointerLockElement === this.canvas
                    || document.msPointerLockElement === this.canvas
                    || document['requestPointerLock'] === this.canvas);
                if (!this.controlEnabled) {
                    this.camera.detachControl(this.canvas);
                }
                else {
                    this.camera.attachControl(this.canvas);
                }
            };
            document.addEventListener("pointerlockchange", pointerlockchange, false);
            document.addEventListener("mspointerlockchange", pointerlockchange, false);
            document.addEventListener("mozpointerlockchange", pointerlockchange, false);
            document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
            var box = BABYLON.Mesh.CreateBox("box", 0.5, this.scene);
            box.scaling.x = 10;
            box.scaling.y = 0.3;
            box.scaling.z = 0.3;
            var material = new BABYLON.StandardMaterial('test', this.scene);
            material.diffuseColor = new BABYLON.Color3(1, 1, 1);
            box.rotate(new BABYLON.Vector3(0, 180, 0), -1.9);
            box.material = material;
            box.parent = this.camera;
            box.position = new BABYLON.Vector3(1, -1, 1);
            this.light = new BABYLON.PointLight('light', new BABYLON.Vector3(15, 15, 15), this.scene);
            this.ground = BABYLON.Mesh.CreateGround('ground', 1000, 100, 32, this.scene);
            var groundmaterial = new BABYLON.StandardMaterial('test2', this.scene);
            groundmaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
            this.ground.material = groundmaterial;
            this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0,
            });
            this.engine.runRenderLoop(function () {
                while (_this.sheeps < _this.maxSheep) {
                    _this.createSheep();
                    _this.sheeps++;
                }
            });
            this.createSkybox();
        }
        Main.prototype.createSheep = function () {
            var _this = this;
            var assetsManager = new BABYLON.AssetsManager(this.scene);
            var meshTask = assetsManager.addMeshTask("sheep", "", "./assets/", "mouton-bab.babylon");
            meshTask.onSuccess = function (task) {
                var sheep = task.loadedMeshes[0];
                sheep.position = new BABYLON.Vector3(0, 3, 0);
                var material = new BABYLON.StandardMaterial('sheepColor', _this.scene);
                sheep.material = material;
                material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                //material.emissiveColor = new Color3(1, 0, 0);
                _this.engine.runRenderLoop(function () {
                    _this.sheepMove(sheep);
                });
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
            sheep.actionManager = new BABYLON.ActionManager(this.scene);
            sheep.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (event) {
                console.log("test");
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