var BABYLON;
(function (BABYLON) {
    var Main = /** @class */ (function () {
        /**
         * Constructor
         */
        function Main() {
            this.engine = new BABYLON.Engine(document.getElementById('renderCanvas'));
            this.scene = new BABYLON.Scene(this.engine);
            this.scene.enablePhysics(new BABYLON.Vector3(0, -50.81, 0), new BABYLON.CannonJSPlugin());
            this.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(50, 10, 0), this.scene);
            this.camera.attachControl(this.engine.getRenderingCanvas());
            this.camera.setTarget(new BABYLON.Vector3(0, 15, 0));
            this.light = new BABYLON.PointLight('light', new BABYLON.Vector3(15, 15, 15), this.scene);
            this.ground = BABYLON.Mesh.CreateGround('ground', 1000, 100, 32, this.scene);
            this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0
            });
            this.createSheep();
            this.createSkybox();
        }
        Main.prototype.createSheep = function () {
            var _this = this;
            var assetsManager = new BABYLON.AssetsManager(this.scene);
            var meshTask = assetsManager.addMeshTask("sheep", "", "./assets/", "mouton-bab.babylon");
            meshTask.onSuccess = function (task) {
                var sheep = task.loadedMeshes[0];
                sheep.position = new BABYLON.Vector3(0, 5, 0);
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
            this._skybox = BABYLON.Mesh.CreateBox('skybox', 1000, this.scene, false, BABYLON.Mesh.BACKSIDE);
            var skyboxMaterial = new BABYLON.StandardMaterial('skyboxMaterial', this.scene);
            skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('assets/TropicalSunnyDay', this.scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            skyboxMaterial.disableLighting = true;
            this._skybox.infiniteDistance = true;
            this._skybox.material = skyboxMaterial;
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