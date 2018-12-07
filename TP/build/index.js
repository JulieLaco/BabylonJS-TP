var BABYLON;
(function (BABYLON) {
    var Main = /** @class */ (function () {
        /**
         * Constructor
         */
        function Main() {
            var _this = this;
            this.rootMonsters = [];
            this.isRunningMonsters = [];
            this.count = 0;
            this.nbMonster = 1;
            this.playerMaxLife = 5;
            this.playerLifes = [];
            this.engine = new BABYLON.Engine(document.getElementById('renderCanvas'));
            this.engine.enableOfflineSupport = false;
            this.scene = new BABYLON.Scene(this.engine);
            this.scene.enablePhysics(new BABYLON.Vector3(0, -50.81, 0), new BABYLON.CannonJSPlugin());
            this.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(50, 10, 0), this.scene);
            this.camera.attachControl(this.engine.getRenderingCanvas());
            this.camera.setTarget(new BABYLON.Vector3(0, 15, 0));
            this.light = new BABYLON.PointLight('light', new BABYLON.Vector3(200, 150, 15), this.scene);
            this.groundBase = BABYLON.Mesh.CreateGround('groundBase', 1000, 1000, 32, this.scene);
            this.groundBase.position.y = this.groundBase.position.y - 1;
            this.groundBase.physicsImpostor = new BABYLON.PhysicsImpostor(this.groundBase, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0
            });
            var textureBase = new BABYLON.Texture("./assets/SiteWork.Planting.Grass.StAugustine1.jpg", this.scene);
            textureBase.uScale = 15.0;
            textureBase.vScale = 15.0;
            var materialBase = new BABYLON.StandardMaterial("groundMatBase", this.scene);
            materialBase.diffuseTexture = textureBase;
            this.groundBase.material = materialBase;
            this.ground = BABYLON.Mesh.CreateGround('ground', 1000, 100, 32, this.scene);
            this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0
            });
            var myTexture = new BABYLON.Texture("./assets/road.jpg", this.scene);
            myTexture.uScale = 15.0;
            myTexture.vScale = 15.0;
            var material = new BABYLON.StandardMaterial("groundMat", this.scene);
            material.diffuseTexture = myTexture;
            this.ground.material = material;
            this.LoadMusic();
            setTimeout(function () {
                _this.ititialiseAlert();
            }, 500);
        }
        Main.prototype.boardLoading = function () {
            /*
                set interval avec comme message d'affichage (5, 4, 3, 2, 1, GO) => équivalent au temps de chargement de setTimeOut;
                Initialiser la map;
                Initialiser les 10 robots de course dans un tableau de Scene => Monsters;
                Initaliser d'autre robots comme spectateurs dans la map;
            */
            this.createSkybox();
            this.initialiseMap();
            this.initialiseMonster();
            this.initialisePV();
            this.gameOver();
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
        Main.prototype.LoadMusic = function () {
            this.monsterDieSound = new BABYLON.Sound('Music', './project_Music/Joueur du Grenier - Excalibur 2555 A.D - Playstation - Le cri du scorpion.mp3', this.scene);
            this.menuSound = new BABYLON.Sound('MusicMenu', './project_Music/David_Goodenough_-_JDG.mp3', this.scene, null, {
                loop: true
            });
        };
        Main.prototype.initialisePV = function () {
            var heartSpriteManager = new BABYLON.SpriteManager("heart_SpriteManager", "./assets/Heart.png", this.playerMaxLife, 800, this.scene);
            for (var x = -(Math.floor(this.playerMaxLife / 2)); x < Math.floor(this.playerMaxLife / 2) + 1; x++) {
                var coeur = new BABYLON.Sprite("heart_" + x, heartSpriteManager);
                coeur.position.z = -5 * x;
                coeur.position.y = 28;
                coeur.width = 5;
                coeur.height = 5;
                coeur.isVisible = true;
                this.playerLifes.push(coeur);
            }
        };
        Main.prototype.ititialiseAlert = function () {
            var _this = this;
            var menuSpriteSpriteManager = new BABYLON.SpriteManager("menuSpriteSpriteManager", "./assets/Infogrames.jpg", 1, 800, this.scene);
            var menuSprite = new BABYLON.Sprite("menuSprite", menuSpriteSpriteManager);
            menuSprite.width = 10;
            menuSprite.height = 10;
            menuSprite.position.x = this.camera.position.x - 5;
            menuSprite.position.z = 0;
            menuSprite.position.y = 8;
            menuSprite.isPickable = false;
            var JMBSpriteSpriteManager = new BABYLON.SpriteManager("JMBSpriteSpriteManager", "./assets/JMB.png", 1, 800, this.scene);
            var JMBSprite = new BABYLON.Sprite("JMBSprite", JMBSpriteSpriteManager);
            JMBSprite.width = 1.3;
            JMBSprite.height = 1.3;
            JMBSprite.position.z = -0.045;
            JMBSprite.position.y = 9.3;
            JMBSprite.position.x = this.camera.position.x - 3;
            JMBSprite.isPickable = false;
            var DGESpriteSpriteManager = new BABYLON.SpriteManager("DGESpriteSpriteManager", "./assets/DGE.png", 1, 800, this.scene);
            var DGESprite = new BABYLON.Sprite("DGESprite", DGESpriteSpriteManager);
            DGESprite.width = 2;
            DGESprite.height = 2;
            DGESprite.position.x = this.camera.position.x - 3;
            DGESprite.position.z = -2;
            DGESprite.position.y = 9.5;
            DGESprite.isPickable = false;
            this.menuSound.play();
            setTimeout(function () {
                _this.menuSound.stop();
                menuSprite.isVisible = false;
                JMBSprite.isVisible = false;
                DGESprite.isVisible = false;
                _this.startGame();
            }, 20000);
        };
        Main.prototype.initialiseMap = function () {
        };
        Main.prototype.initialiseMonster = function () {
            var _this = this;
            for (var x = 0; x < this.nbMonster; x++) {
                this.createMonster(x);
            }
            setTimeout(function () {
                _this.OriginalMonster.meshes.forEach(function (element) {
                    if (element.id === "__root__") {
                        _this.rootMonsters.push(element);
                        _this.isRunningMonsters.push(true);
                    }
                });
            }, 5000);
        };
        Main.prototype.createMonster = function (index) {
            var _this = this;
            BABYLON.SceneLoader.ImportMesh("", './assets/', 'RobotExpressive.glb', this.scene, function (newMeshes) {
                var material = new BABYLON.StandardMaterial("mat1", _this.scene);
                material.emissiveColor = new BABYLON.Color3(1, 0, 0);
                newMeshes.forEach(function (mesh) {
                    if (mesh.id === "__root__") {
                        mesh.position = new BABYLON.Vector3(0, -20, 0);
                        mesh.rotation.y = 1.5;
                    }
                    mesh.name += " root" + index;
                    mesh.material = material;
                    mesh.actionManager = new BABYLON.ActionManager(_this.scene);
                    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, function () {
                        _this.shootMonster(mesh.name);
                    }));
                });
                _this.OriginalMonster = _this.scene;
                _this.OriginalMonster.animationGroups.forEach(function (element) {
                    element.stop();
                });
            });
        };
        Main.prototype.startGame = function () {
            var _this = this;
            this.boardLoading();
            setTimeout(function () {
                console.log(_this.OriginalMonster);
                _this.rootMonsters.forEach(function (element) {
                    _this.setMonsterPosition(element);
                });
                _this.letsRun();
            }, 5000);
        };
        Main.prototype.gameOver = function () {
            var gameOverSpriteManager = new BABYLON.SpriteManager("gameOverSpriteManager", "./assets/gameOver.png", 1, 800, this.scene);
            this.gameOverSprite = new BABYLON.Sprite("gameOver", gameOverSpriteManager);
            this.gameOverSprite.position.z = 0;
            this.gameOverSprite.position.y = 10;
            this.gameOverSprite.width = 30;
            this.gameOverSprite.height = 30;
            this.gameOverSprite.isVisible = false;
        };
        Main.prototype.letsRun = function () {
            var _this = this;
            this.engine.runRenderLoop(function () {
                if (_this.camera.rotation.y < -2) {
                    _this.camera.rotation.y = -2;
                }
                if (_this.camera.rotation.y > -1) {
                    _this.camera.rotation.y = -1;
                }
                if (_this.playerMaxLife <= 0) {
                    //  soit on arret le rendu comme fait dessous soit on affiche un écran de défaite
                    _this.gameOverSprite.isVisible = true;
                    setTimeout(function () {
                        _this.engine.stopRenderLoop();
                    }, 500);
                }
                _this.rootMonsters.forEach(function (element) {
                    switch (element) {
                        case _this.rootMonsters[0]: {
                            _this.checkMonsterPosition(element, "root0", 0);
                            if (_this.isRunningMonsters[0] === true) {
                                _this.runMonster(element, 1.5, 6);
                            }
                            break;
                        }
                        case _this.rootMonsters[1]: {
                            if (_this.isRunningMonsters[1] === true) {
                                _this.runMonster(element, 1.5, 20);
                            }
                            break;
                        }
                        case _this.rootMonsters[2]: {
                            if (_this.isRunningMonsters[2] === true) {
                                _this.runMonster(element, 1.5, 34);
                            }
                            break;
                        }
                        case _this.rootMonsters[3]: {
                            if (_this.isRunningMonsters[3] === true) {
                                _this.runMonster(element, 1, 52);
                            }
                            break;
                        }
                        case _this.rootMonsters[4]: {
                            if (_this.isRunningMonsters[4] === true) {
                                _this.runMonster(element, 1, 66);
                            }
                            break;
                        }
                        case _this.rootMonsters[5]: {
                            if (_this.isRunningMonsters[5] === true) {
                                _this.runMonster(element, 1, 80);
                            }
                            break;
                        }
                        case _this.rootMonsters[6]: {
                            if (_this.isRunningMonsters[6] === true) {
                                _this.runMonster(element, 1, 94);
                            }
                            break;
                        }
                        case _this.rootMonsters[7]: {
                            if (_this.isRunningMonsters[7] === true) {
                                _this.runMonster(element, 1, 108);
                            }
                            break;
                        }
                        case _this.rootMonsters[8]: {
                            if (_this.isRunningMonsters[8] === true) {
                                _this.runMonster(element, 1.15, 122);
                            }
                            break;
                        }
                        case _this.rootMonsters[9]: {
                            if (_this.isRunningMonsters[9] === true) {
                                _this.runMonster(element, 1.15, 136);
                            }
                            break;
                        }
                    }
                });
            });
        };
        Main.prototype.setMonsterPosition = function (element) {
            var rdm = Math.floor(Math.random() * 6);
            switch (rdm) {
                case 1: {
                    element.position = new BABYLON.Vector3(0, 0, -20);
                    break;
                }
                case 2: {
                    element.position = new BABYLON.Vector3(0, 0, -10);
                    break;
                }
                case 3: {
                    element.position = new BABYLON.Vector3(0, 0, 0);
                    break;
                }
                case 4: {
                    element.position = new BABYLON.Vector3(0, 0, 10);
                    break;
                }
                case 5: {
                    element.position = new BABYLON.Vector3(0, 0, 20);
                    break;
                }
                default: {
                    element.position = new BABYLON.Vector3(0, 0, 0);
                    break;
                }
            }
        };
        Main.prototype.checkMonsterPosition = function (element, name, index) {
            var _this = this;
            if (element.position.x > this.camera.position.x + 10) {
                this.isRunningMonsters[0] = false;
                this.hide(name);
                this.playerLooseLife();
                setTimeout(function () {
                    _this.respanwMonster(index);
                }, 1000);
                return true;
            }
            return false;
        };
        Main.prototype.runMonster = function (element, speed, animationID) {
            element.position.x += 0.5 * speed;
            this.OriginalMonster.animationGroups[animationID].play(true);
        };
        Main.prototype.shootMonster = function (name) {
            switch (name.substring(name.length - 5)) {
                case "root0": {
                    this.killMonster("root0", 0, 6, 1);
                    break;
                }
                case "root1": {
                    this.killMonster("root1", 1, 20, 15);
                    break;
                }
                case "root2": {
                    this.killMonster("root2", 2, 34, 29);
                    break;
                }
                case "root3": {
                    this.killMonster("root3", 3, 52, 43);
                    break;
                }
                case "root4": {
                    this.killMonster("root4", 4, 66, 57);
                    break;
                }
                case "root5": {
                    this.killMonster("root5", 5, 80, 71);
                    break;
                }
                case "root6": {
                    this.killMonster("root6", 6, 94, 85);
                    break;
                }
                case "root7": {
                    this.killMonster("root7", 7, 108, 99);
                    break;
                }
                case "root8": {
                    this.killMonster("root8", 8, 122, 113);
                    break;
                }
                case "root9": {
                    this.killMonster("root9", 9, 136, 127);
                    break;
                }
            }
        };
        Main.prototype.killMonster = function (name, index, runAnimationID, animationID) {
            var _this = this;
            this.setMonsterPickableOrNot(name);
            this.monsterDieSound.play();
            this.OriginalMonster.animationGroups[animationID].play(false);
            this.OriginalMonster.animationGroups[runAnimationID].stop();
            this.isRunningMonsters[index] = false;
            setTimeout(function () {
                _this.OriginalMonster.animationGroups[animationID].stop();
                _this.hide(name);
                setTimeout(function () {
                    _this.respanwMonster(index);
                }, 1000);
            }, 2000);
        };
        Main.prototype.setMonsterPickableOrNot = function (name) {
            for (var _i = 0, _a = this.OriginalMonster.meshes; _i < _a.length; _i++) {
                var x = _a[_i];
                switch (x.name) {
                    case "skybox": {
                        break;
                    }
                    case "ground": {
                        break;
                    }
                    default: {
                        if (x.name.substring(x.name.length - 5) === name) {
                            x.isPickable = false;
                        }
                        break;
                    }
                }
            }
        };
        Main.prototype.hide = function (name) {
            for (var _i = 0, _a = this.OriginalMonster.meshes; _i < _a.length; _i++) {
                var x = _a[_i];
                switch (x.name) {
                    case "skybox": {
                        break;
                    }
                    case "ground": {
                        break;
                    }
                    default: {
                        if (x.name.substring(x.name.length - 5) === name) {
                            if (x.name === "__root__ " + name) {
                                x.position = new BABYLON.Vector3(0, -20, 0);
                            }
                            x.isPickable = true;
                        }
                        break;
                    }
                }
            }
        };
        Main.prototype.respanwMonster = function (index) {
            this.setMonsterPosition(this.rootMonsters[index]);
            this.isRunningMonsters[index] = true;
        };
        Main.prototype.playerLooseLife = function () {
            this.playerMaxLife--;
            this.playerLifes[this.playerMaxLife].isVisible = false;
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
            this.scene.registerBeforeRender(function () {
                _this.camera.position = new BABYLON.Vector3(50, 10, 0);
                _this.camera.rotation.x = 0;
            });
            this.engine.runRenderLoop(function () {
                _this.scene.render();
            });
        };
        return Main;
    }());
    BABYLON.Main = Main;
})(BABYLON || (BABYLON = {}));
// module BABYLON {
//     export class Main {
//         // Public members
//         public engine: Engine;
//         public scene: Scene;
//         public camera: FreeCamera;
//         public light: PointLight;
//         public ground: GroundMesh;
//         public sheepDiesound: Sound;
//         public skybox: Mesh;
//         public Maxsheep: number;
//         public sheeps: Mesh[] = [];
//         public nbsheep: number = 0;
//         /**
//          * Constructor
//          */
//         constructor () {
//             this.engine = new Engine(<HTMLCanvasElement> document.getElementById('renderCanvas'));
//             this.scene = new Scene(this.engine);
//             this.scene.enablePhysics(new Vector3(0, -50.81, 0), new CannonJSPlugin());
//             this.camera = new FreeCamera('camera', new Vector3(50, 10, 0), this.scene);
//             this.camera.attachControl(this.engine.getRenderingCanvas());
//             this.camera.setTarget(new Vector3(0, 15, 0));
//             this.light = new PointLight('light', new Vector3(15, 15, 15), this.scene);
//             this.ground = <GroundMesh> Mesh.CreateGround('ground', 1000, 100, 32, this.scene);
//             this.ground.physicsImpostor = new PhysicsImpostor(this.ground, PhysicsImpostor.BoxImpostor, {
//                 mass: 0
//             });
//             this.createSkybox();
//             this.LoadMusic();
//             this.Maxsheep = 10;
//             this.engine.runRenderLoop(() => {
//                 for(let sheep of this.sheeps)
//                 {
//                     this.sheepRun(sheep);
//                 }
//                 while(this.nbsheep <= this.Maxsheep)
//                 {
//                     this.Createsheep();
//                 }
//             });
//         }
//         public createSkybox(): void{
//             this.skybox = BABYLON.Mesh.CreateBox('skybox', 1000, this.scene, false, BABYLON.Mesh.BACKSIDE);
//             let skyboxMaterial = new BABYLON.StandardMaterial('skyboxMaterial', this.scene);
//             skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('assets/TropicalSunnyDay', this.scene);
//             skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
//             skyboxMaterial.disableLighting = true;
//             this.skybox.infiniteDistance = true;
//             this.skybox.material = skyboxMaterial;
//         }
//         public LoadMusic(): void {
//             this.sheepDiesound = new BABYLON.Sound('Music', 
//             './project_Music/Joueur du Grenier - Excalibur 2555 A.D - Playstation - Le cri du scorpion.mp3', 
//             this.scene)
//         }
//         public Createsheep(): void{
//             let sheep = Mesh.CreateBox('sheep', 2, this.scene);
//             const material = new StandardMaterial('material', this.scene);
//             material.diffuseTexture = new Texture('./assets/david_goodenough_by_rubombee-dc6phwh.png', this.scene);
//             sheep.material = material;
//             let line = Math.floor(Math.random() * 3);
//             this.nbsheep++;
//             switch(line){
//                 case 0:{
//                     sheep.position = new Vector3(0, 2, -25);
//                     break;
//                 }
//                 case 1:{
//                     sheep.position = new Vector3(0, 2, 0);
//                     break;
//                 }
//                 case 2:{
//                     sheep.position = new Vector3(0, 2, 25);
//                     break;
//                 }
//                 default:{
//                     sheep.position = new Vector3(0, 2, 0);
//                     break;
//                 }
//             }
//             this.sheepExplode(sheep);  
//             let isAdd: boolean = false;
//             for(let x of this.sheeps)
//             {
//                 if(x === null)
//                 {
//                     this.sheeps[this.sheeps.indexOf(x)] = sheep;
//                     isAdd = true;
//                     break;  
//                 }
//             }
//             if(isAdd === false)
//             {
//                 this.sheeps.push(sheep);
//             }
//         }
//         public sheepExplode (sheep:Mesh): void{
//             sheep.actionManager = new ActionManager(this.scene);
//             sheep.actionManager.registerAction(new ExecuteCodeAction(
//                 ActionManager.OnLeftPickTrigger,
//                 () => {
//                     this.Killsheep(sheep);
//                     this.sheepDiesound.play();
//                 }
//             ));
//         }
//         public sheepRun(sheep): void{
//             if(sheep !== null)
//             {
//                 sheep.position.x += 0.2;
//                 if(sheep.position.x > this.camera.position.x)
//                 {
//                     this.Killsheep(sheep);
//                 }
//             }
//         }
//         public Killsheep(sheep) : void{
//             sheep.dispose(true, true);
//             this.nbsheep--;
//             this.sheeps[this.sheeps.indexOf(sheep)] = null;
//         }
//         /**
//          * Setup physics for the given cube
//          */
//         public setupPhysics (cube: Mesh): void {
//             cube.physicsImpostor = new PhysicsImpostor(cube, PhysicsImpostor.BoxImpostor, {
//                 mass: 1
//             });
//         }
//         /**
//          * Runs the engine to render the scene into the canvas
//          */
//         public run () {
//             this.engine.runRenderLoop(() => {
//                 this.scene.render();
//             });
//         }
//     }
// }
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