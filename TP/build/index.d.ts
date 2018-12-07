/// <reference types="babylonjs" />
declare module BABYLON {
    class Main {
        engine: Engine;
        scene: Scene;
        camera: FreeCamera;
        light: PointLight;
        ground: GroundMesh;
        monsterDieSound: Sound;
        menuSound: Sound;
        skybox: Mesh;
        OriginalMonster: Scene;
        rootMonsters: any[];
        isRunningMonsters: boolean[];
        count: number;
        nbMonster: number;
        playerMaxLife: number;
        playerLifes: Sprite[];
        gameOverSprite: Sprite;
        /**
         * Constructor
         */
        constructor();
        boardLoading(): void;
        createSkybox(): void;
        LoadMusic(): void;
        initialisePV(): void;
        ititialiseAlert(): void;
        initialiseMap(): void;
        initialiseMonster(): void;
        createMonster(index: any): void;
        startGame(): void;
        gameOver(): void;
        letsRun(): void;
        setMonsterPosition(element: any): void;
        checkMonsterPosition(element: any, name: any, index: any): boolean;
        runMonster(element: any, speed: any, animationID: any): void;
        shootMonster(name: string): void;
        killMonster(name: any, index: any, runAnimationID: any, animationID: any): void;
        setMonsterPickableOrNot(name: any): void;
        hide(name: any): void;
        respanwMonster(index: any): void;
        playerLooseLife(): void;
        /**
         * Setup physics for the given cube
         */
        setupPhysics(cube: Mesh): void;
        /**
         * Runs the engine to render the scene into the canvas
         */
        run(): void;
    }
}
declare module BABYLON {
    class OceanMaterial {
        material: ShaderMaterial;
        diffuseSampler1: Texture;
        diffuseSampler2: Texture;
        time: number;
        /**
         * Constructor
         * @param scene the scene where to add the material
         */
        constructor(scene: Scene);
    }
}
