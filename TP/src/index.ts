module BABYLON {
    export class Main {

        /*  => ANIMATION 
        this.OriginalMonster.animationGroups[1].play(true);     //  ROBOT1 : 0 => 13
        this.OriginalMonster.animationGroups[15].play(true);    //  ROBOT2 : 14 => 27
        this.OriginalMonster.animationGroups[29].play(true);    //  ROBOT3 : 28 => 41
        this.OriginalMonster.animationGroups[43].play(true);    //  ROBOT4 : 42 => 55
        this.OriginalMonster.animationGroups[57].play(true);    //  ROBOT5 : 56 => 69
        this.OriginalMonster.animationGroups[71].play(true);    //  ROBOT6 : 70 => 53
        this.OriginalMonster.animationGroups[85].play(true);    //  ROBOT7 : 84 => 97
        this.OriginalMonster.animationGroups[99].play(true);    //  ROBOT8 : 98 => 111
        this.OriginalMonster.animationGroups[113].play(true);   //  ROBOT9 : 112 => 125
        this.OriginalMonster.animationGroups[127].play(true);   //  ROBOT10 : 126 => 139
        */

        public engine: Engine;
        public scene: Scene;

        public camera: FreeCamera;
        public light: PointLight;

        public ground: GroundMesh;
        public groundBase : GroundMesh;

        public monsterDieSound: Sound;
        public menuSound: Sound;

        public skybox: Mesh;

        public OriginalMonster : Scene;
        public rootMonsters = [];
        public isRunningMonsters : boolean[] = [];
        public count = 0;
        public nbMonster = 1;
        public playerMaxLife = 5;
        public playerLifes : Sprite[] = [];
        public gameOverSprite : Sprite;

        
        /**
         * Constructor
         */
        constructor () {
            this.engine = new Engine(<HTMLCanvasElement> document.getElementById('renderCanvas'));
            this.engine.enableOfflineSupport = false;

            this.scene = new Scene(this.engine);
            this.scene.enablePhysics(new Vector3(0, -50.81, 0), new CannonJSPlugin());

            this.camera = new FreeCamera('camera', new Vector3(50, 10, 0), this.scene);
            this.camera.attachControl(this.engine.getRenderingCanvas());
            this.camera.setTarget(new Vector3(0, 15, 0));

            this.light = new PointLight('light', new Vector3(200, 150, 15), this.scene);

            this.groundBase = <GroundMesh> Mesh.CreateGround('groundBase', 1000, 1000, 32, this.scene);
            this.groundBase.position.y = this.groundBase.position.y - 1;
            this.groundBase.physicsImpostor = new PhysicsImpostor(this.groundBase, PhysicsImpostor.BoxImpostor, {
                mass: 0
            });

            let textureBase = new BABYLON.Texture("./assets/SiteWork.Planting.Grass.StAugustine1.jpg", this.scene);
            textureBase.uScale = 15.0;
            textureBase.vScale = 15.0;
            let materialBase = new BABYLON.StandardMaterial("groundMatBase", this.scene);
            materialBase.diffuseTexture = textureBase;
            this.groundBase.material = materialBase;

            this.ground = <GroundMesh> Mesh.CreateGround('ground', 1000, 100, 32, this.scene);
            this.ground.physicsImpostor = new PhysicsImpostor(this.ground, PhysicsImpostor.BoxImpostor, {
                mass: 0
            });

            let myTexture = new BABYLON.Texture("./assets/road.jpg", this.scene);
            myTexture.uScale = 15.0;
            myTexture.vScale = 15.0;
            let material = new BABYLON.StandardMaterial("groundMat", this.scene);
            material.diffuseTexture = myTexture;
            this.ground.material = material;

            this.initialiseMonster();
            this.LoadMusic();
            setTimeout(() => {
                this.ititialiseAlert();
            }, 500);

        }

        public boardLoading(): void{
            /*
                set interval avec comme message d'affichage (5, 4, 3, 2, 1, GO) => équivalent au temps de chargement de setTimeOut;
                Initialiser la map;
                Initialiser les 10 robots de course dans un tableau de Scene => Monsters;
                Initaliser d'autre robots comme spectateurs dans la map;
            */
            this.createSkybox();
            this.initialiseMap();
            this.initialisePV();
            this.gameOver();
        }

        public createSkybox(): void{
            this.skybox = BABYLON.Mesh.CreateBox('skybox', 1000, this.scene, false, BABYLON.Mesh.BACKSIDE);
            let skyboxMaterial = new BABYLON.StandardMaterial('skyboxMaterial', this.scene);
            skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('assets/TropicalSunnyDay', this.scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            skyboxMaterial.disableLighting = true;
            this.skybox.infiniteDistance = true;
            this.skybox.material = skyboxMaterial;
        }

        public LoadMusic(): void {
            this.monsterDieSound = new BABYLON.Sound('Music', 
            './project_Music/Joueur du Grenier - Excalibur 2555 A.D - Playstation - Le cri du scorpion.mp3', 
            this.scene)

            this.menuSound = new BABYLON.Sound('MusicMenu', 
            './project_Music/David_Goodenough_-_JDG.mp3', 
            this.scene, null,  {
                loop : true
            })
        }

        public initialisePV(): void{
            let heartSpriteManager = new BABYLON.SpriteManager("heart_SpriteManager", "./assets/Heart.png", this.playerMaxLife, 800, this.scene);
            for(let x = -(Math.floor(this.playerMaxLife / 2)); x < Math.floor(this.playerMaxLife / 2) + 1; x++){
                let coeur = new BABYLON.Sprite("heart_" + x, heartSpriteManager);
                coeur.position.z = -5 * x;
                coeur.position.y = 28;
                coeur.width = 5;
                coeur.height = 5;
                coeur.isVisible = true;
                this.playerLifes.push(coeur);
            }
        }

        public ititialiseAlert(): void 
        {
            let menuSpriteSpriteManager = new BABYLON.SpriteManager("menuSpriteSpriteManager", "./assets/Infogrames.jpg", 1, 800, this.scene);
            let menuSprite = new BABYLON.Sprite("menuSprite", menuSpriteSpriteManager);
            menuSprite.width = 10;
            menuSprite.height = 10;
            menuSprite.position.x = this.camera.position.x - 5;
            menuSprite.position.z = 0;
            menuSprite.position.y = 8;
            menuSprite.isPickable = false;

            let JMBSpriteSpriteManager = new BABYLON.SpriteManager("JMBSpriteSpriteManager", "./assets/JMB.png", 1, 800, this.scene);
            let JMBSprite = new BABYLON.Sprite("JMBSprite", JMBSpriteSpriteManager);
            JMBSprite.width = 1.3;
            JMBSprite.height = 1.3;
            JMBSprite.position.z = -0.045;
            JMBSprite.position.y = 9.3;
            JMBSprite.position.x = this.camera.position.x - 3;
            JMBSprite.isPickable = false;

            let DGESpriteSpriteManager = new BABYLON.SpriteManager("DGESpriteSpriteManager", "./assets/DGE.png", 1, 800, this.scene);
            let DGESprite = new BABYLON.Sprite("DGESprite", DGESpriteSpriteManager);
            DGESprite.width = 2;
            DGESprite.height = 2;
            DGESprite.position.x = this.camera.position.x - 3;
            DGESprite.position.z = -2;
            DGESprite.position.y = 9.5;
            DGESprite.isPickable = false;

            this.menuSound.play();
            setTimeout(() => {
                this.menuSound.stop();
                menuSprite.isVisible = false;
                JMBSprite.isVisible = false;
                DGESprite.isVisible = false;
                this.startGame();
            }, 20000);
        }

        public initialiseMap(): void{

        }

        public initialiseMonster(): void{
            for(let x = 0; x < this.nbMonster; x++){
                this.createMonster(x);
            }

            setTimeout(() => {
                this.OriginalMonster.meshes.forEach(element => {
                    if(element.id === "__root__"){
                        this.rootMonsters.push(element);
                        this.isRunningMonsters.push(true);
                    }
                });
            }, 5000);
        }

        public createMonster(index): void{
            BABYLON.SceneLoader.ImportMesh("", './assets/', 'RobotExpressive.glb', this.scene, (newMeshes) => {
                
                let material = new BABYLON.StandardMaterial("mat1", this.scene);
                material.emissiveColor = new BABYLON.Color3(1, 0, 0);

                newMeshes.forEach((mesh) => {
                    if(mesh.id === "__root__"){
                        mesh.position = new Vector3(0, -20, 0);
                        mesh.rotation.y = 1.5;
                    }
                    mesh.name += " root" + index;
                    mesh.material = material;
                    mesh.actionManager = new ActionManager(this.scene);
                    mesh.actionManager.registerAction(new ExecuteCodeAction(
                    ActionManager.OnLeftPickTrigger, () => {
                            this.shootMonster(mesh.name);
                        }
                    ));
                });

                this.OriginalMonster = this.scene;
                this.OriginalMonster.animationGroups.forEach(element => {
                    element.stop();
                });
            });
        }

        public startGame(): void{

            this.boardLoading();

            setTimeout( () => {
                console.log(this.OriginalMonster);
                this.rootMonsters.forEach(element => {
                    this.setMonsterPosition(element);
                });
                this.letsRun();
            }, 5000)
        }

        public gameOver(): void {
            let gameOverSpriteManager = new BABYLON.SpriteManager("gameOverSpriteManager", "./assets/gameOver.png", 1, 800, this.scene);
            this.gameOverSprite = new BABYLON.Sprite("gameOver", gameOverSpriteManager);
            this.gameOverSprite.position.z = 0;
            this.gameOverSprite.position.y = 10;
            this.gameOverSprite.width = 30;
            this.gameOverSprite.height = 30;
            this.gameOverSprite.isVisible = false;
        }

        public letsRun(): void{
            this.engine.runRenderLoop(() => {
                if(this.camera.rotation.y < -2) {
                    this.camera.rotation.y = -2;
                }
                if(this.camera.rotation.y > -1) {
                    this.camera.rotation.y = -1;
                }

                if(this.playerMaxLife <= 0){
                    //  soit on arret le rendu comme fait dessous soit on affiche un écran de défaite
                    this.gameOverSprite.isVisible = true;
                    setTimeout(() => {
                        this.engine.stopRenderLoop();
                    }, 500);
                }
                this.rootMonsters.forEach(element => {
                    switch(element){
                        case this.rootMonsters[0]:{
                            this.checkMonsterPosition(element, "root0", 0);
                            if(this.isRunningMonsters[0] === true){
                                this.runMonster(element, 1.5, 6);
                            }
                            break;
                        }
                        case this.rootMonsters[1]:{
                            if(this.isRunningMonsters[1] === true){
                                this.runMonster(element, 1.5, 20);
                            }
                            break;
                        }
                        case this.rootMonsters[2]:{
                            if(this.isRunningMonsters[2] === true){
                                this.runMonster(element, 1.5, 34);
                            }
                            break;
                        }
                        case this.rootMonsters[3]:{
                            if(this.isRunningMonsters[3] === true){
                                this.runMonster(element, 1, 52);
                            }
                            break;
                        }
                        case this.rootMonsters[4]:{
                           if(this.isRunningMonsters[4] === true){
                                this.runMonster(element, 1, 66);
                            }
                            break;
                        }
                        case this.rootMonsters[5]:{
                            if(this.isRunningMonsters[5] === true){
                                this.runMonster(element, 1, 80);
                            }
                            break;
                        }
                        case this.rootMonsters[6]:{
                            if(this.isRunningMonsters[6] === true){
                                this.runMonster(element, 1, 94);
                            }
                            break;
                        }
                        case this.rootMonsters[7]:{
                            if(this.isRunningMonsters[7] === true){
                                this.runMonster(element, 1, 108);
                            }
                            break;
                        }
                        case this.rootMonsters[8]:{
                            if(this.isRunningMonsters[8] === true){
                                this.runMonster(element, 1.15, 122);
                            }
                            break;
                        }
                        case this.rootMonsters[9]:{
                            if(this.isRunningMonsters[9] === true){
                                this.runMonster(element, 1.15, 136);
                            }
                            break;
                        }
                    }
                });
            });
        }

        public setMonsterPosition(element): void{
            let rdm = Math.floor(Math.random() * 6);
            switch(rdm){
                case 1:{
                    element.position = new Vector3(0, 0, -20);
                    break;
                }
                case 2:{
                    element.position = new Vector3(0, 0, -10);
                    break;
                }
                case 3:{
                    element.position = new Vector3(0, 0, 0);
                    break;
                }
                case 4:{
                    element.position = new Vector3(0, 0, 10);
                    break;
                }
                case 5:{
                    element.position = new Vector3(0, 0, 20);
                    break;
                }
                default:{
                    element.position = new Vector3(0, 0, 0);
                    break;
                }
            }
        }

        public checkMonsterPosition(element, name, index): boolean{
            if(element.position.x > this.camera.position.x + 10){
                this.isRunningMonsters[0] = false;
                this.hide(name);
                this.playerLooseLife();
                setTimeout(() => {
                    this.respanwMonster(index);
                }, 1000);
                return true;
            }
            return false;
        }

        public runMonster(element, speed, animationID): void{
            element.position.x += 0.5 * speed;
            this.OriginalMonster.animationGroups[animationID].play(true);
        }

        public shootMonster(name : string): void{
            switch(name.substring(name.length - 5)){
                case "root0":{
                    this.killMonster("root0", 0, 6, 1);
                    break;
                }
                case "root1":{
                    this.killMonster("root1", 1, 20, 15);
                    break;
                }
                case "root2":{
                    this.killMonster("root2", 2, 34, 29);
                    break;
                }
                case "root3":{
                    this.killMonster("root3", 3, 52, 43);
                    break;
                }
                case "root4":{
                    this.killMonster("root4", 4, 66, 57);
                    break;
                }
                case "root5":{
                    this.killMonster("root5", 5, 80, 71);
                    break;
                }
                case "root6":{
                    this.killMonster("root6", 6, 94, 85);
                    break;
                }
                case "root7":{
                    this.killMonster("root7", 7, 108, 99);
                    break;
                }
                case "root8":{
                    this.killMonster("root8", 8, 122, 113);
                    break;
                }
                case "root9":{
                    this.killMonster("root9", 9, 136, 127);
                    break;
                }
            }
        }

        public killMonster(name, index, runAnimationID, animationID): void{
            this.setMonsterPickableOrNot(name);
            this.monsterDieSound.play();
            this.OriginalMonster.animationGroups[animationID].play(false);
            this.OriginalMonster.animationGroups[runAnimationID].stop();
            this.isRunningMonsters[index] = false;
            setTimeout(() => {
                this.OriginalMonster.animationGroups[animationID].stop();
                this.hide(name);
                setTimeout(() => {
                    this.respanwMonster(index);
                }, 1000);
            }, 2000);
        }

        public setMonsterPickableOrNot(name): void{
            for(let x of this.OriginalMonster.meshes){
                switch(x.name){
                    case "skybox":{
                        break;
                    }
                    case "ground":{
                        break;
                    }
                    default:{
                        if(x.name.substring(x.name.length - 5) === name)
                        {
                            x.isPickable = false;
                        }
                        break;
                    }
                }
            }
        }

        public hide(name): void{
            for(let x of this.OriginalMonster.meshes){
                switch(x.name){
                    case "skybox":{
                        break;
                    }
                    case "ground":{
                        break;
                    }
                    default:{
                        if(x.name.substring(x.name.length - 5) === name)
                        {
                            if(x.name === "__root__ " + name)
                            {
                                x.position = new Vector3(0, -20, 0);
                            }
                            x.isPickable = true;
                        }
                        break;
                    }
                }
            }
        }

        public respanwMonster(index): void{
            this.setMonsterPosition(this.rootMonsters[index]);
            this.isRunningMonsters[index] = true;
        }

        public playerLooseLife(): void{
            this.playerMaxLife--;
            this.playerLifes[this.playerMaxLife].isVisible = false;
        }

    
        /**
         * Setup physics for the given cube
         */
        public setupPhysics (cube: Mesh): void {
            cube.physicsImpostor = new PhysicsImpostor(cube, PhysicsImpostor.BoxImpostor, {
                mass: 1
            });
        }

        /**
         * Runs the engine to render the scene into the canvas
         */
        public run () {
            this.scene.registerBeforeRender(() => {
                this.camera.position = new Vector3(50, 10, 0);
                this.camera.rotation.x = 0;
            });
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
        }
    }
}
