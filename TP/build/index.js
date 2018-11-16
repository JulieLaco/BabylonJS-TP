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
            this.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(35, 35, 35), this.scene);
            this.camera.attachControl(this.engine.getRenderingCanvas());
            this.camera.setTarget(new BABYLON.Vector3(0, 15, 0));
            this.light = new BABYLON.PointLight('light', new BABYLON.Vector3(15, 15, 15), this.scene);
            this.ground = BABYLON.Mesh.CreateGround('ground', 512, 512, 32, this.scene);
            this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0
            });
            this.createSheep();
            // Create cubes
            // const height = 15;
            // const width = 10;
            // const size = 5;
            // const diffuse = new Texture('./assets/diffuse.png', this.scene);
            // const normal = new Texture('./assets/normal.png', this.scene);
            // for (let i = 0; i < height; i++) {
            //     let offsetX = -(width / 2) * 5;
            //     for (let j = 0; j < width; j++) {
            //         const cube = Mesh.CreateBox('cube', size, this.scene);
            //         cube.position.x = offsetX;
            //         cube.position.y = (5 * i) + size / 2;
            //         const material = new StandardMaterial('cubemat', this.scene);
            //         material.diffuseTexture = diffuse;
            //         material.bumpTexture = normal;
            //         cube.material = material;
            //         offsetX += size;
            //         this.setupActions(cube);
            //         this.setupPhysics(cube);
            //     }
            // }
        }
        Main.prototype.createSheep = function () {
            var cube = BABYLON.Mesh.CreateBox('cube', 5, this.scene);
            cube.position.x = 5;
            cube.position.y = 5;
            //BABYLON.SceneLoader.ImportMesh('sheep', './assets/', 'mouton3.babylon', this.scene);
            var assetsManager = new BABYLON.AssetsManager(this.scene);
            var meshTask = assetsManager.addMeshTask("sheep", "", "./assets/", "mouton-bab.babylon");
            meshTask.onSuccess = function (task) {
                var mouton = task.loadedMeshes[0];
                mouton.position = new BABYLON.Vector3(5, 5, 5);
                var material = new BABYLON.StandardMaterial('sheepColor', this.scene);
                mouton.material = material;
                material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                material.emissiveColor = new BABYLON.Color3(1, 0, 0);
            };
            meshTask.onError = function (task, message, exception) {
                console.log(message, exception);
            };
            assetsManager.load();
        };
        /**
         * Setup action for the given cube
         */
        Main.prototype.setupActions = function (cube) {
            var _this = this;
            cube.actionManager = new BABYLON.ActionManager(this.scene);
            cube.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, function (evt) {
                var direction = cube.position.subtract(_this.scene.activeCamera.position);
                cube.applyImpulse(direction, new BABYLON.Vector3(0, -1, 0));
            }));
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