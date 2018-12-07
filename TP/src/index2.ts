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
