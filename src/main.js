// import Three.js modules
import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js";
import * as gui from "../node_modules/lil-gui/dist/lil-gui.esm.js";

// Global object which will contain all the functions and variables, replicating so, the namespace in JavaScript. An example of anti-pattern, but will do for this small application.
let GameManager = {};

// Creating Three.js objects, and storing them in the globaj object GameManager.
GameManager.init = function () {
  // Fullscreen scene size
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Camera attributes
  const viewAngle = 45;
  const aspect = width / height;
  const near = 0.1;
  const far = 1000;

  // Creating the scene, the camera and the renderer.
  GameManager.renderer = new THREE.WebGLRenderer();
  GameManager.renderer.setSize(width, height);

  GameManager.scene = new THREE.Scene();
  GameManager.camera = new THREE.PerspectiveCamera(
    viewAngle,
    aspect,
    near,
    far
  );
  // Camera starts at (0, 0, 0) looking at (0, 0, -1) with an up vector of (0, 1, 0). So, we pull it back at:
  GameManager.camera.position.z = 400;
  // Adding the camera to the scene.

  // Adding some light
  const ambientLight = new THREE.AmbientLight(0x404040, 10);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 20);
  directionalLight.position.set(0, 1, 0);
  directionalLight.castShadow = true;
  const pointLight = new THREE.PointLight(0xc4c4c4, 2);
  pointLight.position.set(0, 300, 500);
  const pointLight2 = new THREE.PointLight(0xc4c4c4, 5);
  pointLight2.position.set(500, 100, 0);
  const pointLight3 = new THREE.PointLight(0xc4c4c4, 5);
  pointLight3.position.set(0, 100, -500);
  const pointLight4 = new THREE.PointLight(0xc4c4c4, 5);
  pointLight4.position.set(-500, 300, 500);

  GameManager.scene.add(
    ambientLight,
    directionalLight,
    pointLight,
    pointLight2,
    pointLight3,
    pointLight4
  );
  GameManager.scene.add(GameManager.camera);

  // gltf loader for loading the model.
  GameManager.gltfLoader = new GLTFLoader();
  GameManager.gltfLoader.load("robo/scene.gltf", (gltf) => {
    console.log("gltf model here:", gltf);
    const roboModel = gltf.scene;
    // Model scale
    roboModel.scale.set(900, 900, 900);
    // Model position
    roboModel.position.set(25, -60, 253.37);
    // Model rotation
    roboModel.rotation.set(0, 0.5, 0);
    // Model name
    roboModel.name = "roboModel";

    GameManager.scene.add(roboModel);
    this.animate();

    // UI Debugger for the robo model
    // GameManager.gui = new gui.GUI();
    // // Position parameters
    // GameManager.gui
    //   .add(roboModel.position, "x")
    //   .min(-1000)
    //   .max(1000)
    //   .step(0.01)
    //   .name("Robo position x");
    // GameManager.gui
    //   .add(roboModel.position, "y", -100, 100)
    //   .min(-1000)
    //   .max(1000)
    //   .step(0.01)
    //   .name("Robo position y");
    // GameManager.gui
    //   .add(roboModel.position, "z")
    //   .min(-1000)
    //   .max(1000)
    //   .step(0.01)
    //   .name("Robo position z");

    // // Scale parameters
    // GameManager.gui
    //   .add(roboModel.scale, "x")
    //   .min(0)
    //   .max(2000)
    //   .step(0.01)
    //   .name("Robo scale x");
    // GameManager.gui
    //   .add(roboModel.scale, "y")
    //   .min(0)
    //   .max(2000)
    //   .step(0.01)
    //   .name("Robo scale y");
    // GameManager.gui
    //   .add(roboModel.scale, "z")
    //   .min(0)
    //   .max(2000)
    //   .step(0.01)
    //   .name("Robo scale z");
  });

  document.body.appendChild(GameManager.renderer.domElement); // Appending the renderer to the body of the document.

  // The game box attributes
  let gameBoxObj = {
    width: 700,
    height: 400,
    depth: 1200,
    // Number of boxes fitting inside the game box x,y,z axis
    segmentX: 8,
    segmentY: 6,
    segmentZ: 15,
  };

  GameManager.gameBoxObj = gameBoxObj;
  // Size of each box in the game box will be the width of the game box divided by the number of boxes in the axis.
  GameManager.gameBoxSize = gameBoxObj.width / gameBoxObj.segmentX;

  // Creating the game box.
  let gameBox = new THREE.Mesh(
    new THREE.BoxGeometry(
      gameBoxObj.width,
      gameBoxObj.height,
      gameBoxObj.depth,
      gameBoxObj.segmentX,
      gameBoxObj.segmentY,
      gameBoxObj.segmentZ
    ),
    new THREE.MeshBasicMaterial({
      color: "",
      wireframe: true,
    })
  );

  // Adding the game box to the scene.
  GameManager.scene.add(gameBox);

  // Change the scene background color.
  // GameManager.scene.background = new THREE.Color("grey");
  // Set a background image for the scene.
  // GameManager.scene.background = new THREE.TextureLoader().load(
  //   "https://png.pngtree.com/thumb_back/fw800/background/20210312/pngtree-colorful-tetris-lego-blocks-background-image_584426.jpg"
  // ); // Will use drawing lines instead of a texture.

  // Rendering
  GameManager.renderer.render(GameManager.scene, GameManager.camera);

  // Add an event listener to the play button.
  document
    .getElementById("play-button")
    .addEventListener("click", function (event) {
      event.preventDefault();
      GameManager.play();
    });
};

// With the play() method: hide menu instructions and show the points. Also call animate() function.
GameManager.play = function () {
  document.getElementById("menu").style.display = "none";
  GameManager.pointsElement = document.getElementById("points");
  GameManager.pointsElement.style.display = "block";

  //Remove gltf model "roboModel" from the scene.
  GameManager.scene.remove(GameManager.scene.getObjectByName("roboModel"));

  GameManager.animate(); // Will use Window.requestAnimationFrame() to call the animate() function. animate() will call the render method and then call itself again using requestAnimationFrame().
  // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
};

// Time variables
// Calculating when to move the block.
GameManager.gameStepTime = 1000; // This is the time in milliseconds between each step.
GameManager.frameTime = 0; // Time between frames in milliseconds.
GameManager.currentFrameTime = 0; // Time of the current frame in milliseconds.
GameManager.lastFrameTime = Date.now(); // Timestamp of the last frame.

GameManager.gameOver = false; // Boolean to check if the game is over.

// animate() function will call render() method and then call itself again using requestAnimationFrame().
GameManager.animate = function () {
  // Calculating the time between frames.
  let time = Date.now();
  GameManager.frameTime = time - GameManager.lastFrameTime;
  GameManager.lastFrameTime = time;
  GameManager.currentFrameTime += GameManager.frameTime;

  // If the current frame time is greater than the game step time, then move the block.
  if (GameManager.currentFrameTime > GameManager.gameStepTime) {
    // Block movement.
    GameManager.currentFrameTime -= GameManager.gameStepTime;
  }
  // Render the scene.
  GameManager.renderer.render(GameManager.scene, GameManager.camera);

  // If the game is not over, then call the animate() function again.
  if (!GameManager.gameOver) {
    window.requestAnimationFrame(GameManager.animate);
  }
};

// In our game, cubes will be connected when are dynamic and static when they are not. Checking for collisions when the shape touches the floor or another shape. The moving block (with merged geometry of a few cubes) is transformed into static, separated cubes that don't move anymore. It's convenient to keep these cubes in a 3D array.

GameManager.staticBlocks = []; // Array to store the static blocks.

// The color of the Z axis.
GameManager.zColor = [
  0x6666ff, 0x66ffff, 0xcc68ee, 0x666633, 0x66ff66, 0x9966ff, 0x00ff66,
  0x66ee33, 0x003399, 0x330099, 0xffa500, 0x99ff00, 0xee1289, 0x71c671,
  0x00bfff, 0x666633, 0x669966, 0x9966ff,
];

GameManager.createStaticBlocks = function (x, y, z) {
  if (GameManager.staticBlocks[x] === undefined) {
    GameManager.staticBlocks[x] = [];
  }
  if (GameManager.staticBlocks[x][y] === undefined) {
    GameManager.staticBlocks[x][y] = [];
  }

  // Using a Three.js function SceneUtils that takes a geometry and an array of materials and returns a mesh.
  // https://threejs.org/docs/#examples/en/utils/SceneUtils

  const mesh = THREE.SceneUtils.createMultiMaterialObject(
    new THREE.BoxGeometry(
      GameManager.gameBoxSize,
      GameManager.gameBoxSize,
      GameManager.gameBoxSize
    )
  );
};

GameManager.createStaticBlocks(0, 0, 0);

GameManager.init();
