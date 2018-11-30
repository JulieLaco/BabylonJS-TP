/// <reference types="babylonjs" />
declare module BABYLON {
    class Main {
        engine: Engine;
        scene: Scene;
        camera: ArcRotateCamera;
        light: PointLight;
        ground: GroundMesh;
        private skybox;
        private maxSheep;
        private sheeps;
        /**
         * Constructor
         */
        constructor();
        createSheep(): void;
        sheepMove(sheep: AbstractMesh): void;
        sheepExploded(sheep: AbstractMesh): void;
        createSkybox(): void;
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
