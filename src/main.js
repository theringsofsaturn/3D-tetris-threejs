// import Three.js modules
import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js";
import * as gui from "../node_modules/lil-gui/dist/lil-gui.esm.js";

// Global object which will contain all the functions and variables, replicating so, the namespace in JavaScript. An example of anti-pattern, but will do for this small application.
let GameManager = {};

// ######################### GAME INITIALIZATION #########################

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
  // Camera starts at (0, 0, 0) looking at (0, 0, -1) with an up vector of (0, 1, 0). So, I pull it back at:
  GameManager.camera.position.z = 400;
  // Adding the camera to the scene.

  // Adding some light
  const ambientLight = new THREE.AmbientLight(0x404040, 1);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 20);
  directionalLight.position.set(0, 1, 0);
  directionalLight.castShadow = true;
  const pointLight = new THREE.PointLight(0xc4c4c4, 2);
  pointLight.position.set(0, 300, 500);
  const pointLight2 = new THREE.PointLight(0xc4c4c4, 2);
  pointLight2.position.set(500, 100, 0);
  const pointLight3 = new THREE.PointLight(0xc4c4c4, 2);
  pointLight3.position.set(0, 100, -500);
  const pointLight4 = new THREE.PointLight(0xc4c4c4, 2);
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
    width: 900,
    height: 500,
    depth: 1200,
    // Number of boxes fitting inside the game box x,y,z axis
    segmentX: 6,
    segmentY: 6,
    segmentZ: 15,
  };

  GameManager.gameBoxObj = gameBoxObj; // Storing the game box object in the global object GameManager.

  // Size of each box in the game box will be the width of the game box divided by the number of boxes in the axis.
  GameManager.gameBoxSize = gameBoxObj.width / gameBoxObj.segmentX; // Three.js, WebGL, OpenGL have their own units that relate to meters or pixels. This formula is responsible for conversion.

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
      color: 0xffffff,
      wireframe: true,
    })
  );

  GameManager.scene.add(gameBox);

  // Change the scene background color.
  // GameManager.scene.background = new THREE.Color("yellow");
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

// GameManager.staticBlocks = []; // Array to store the static blocks.

// Stores a list of colors to indicate the position of the cube on z axis.
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

  // Using a Three.js function SceneUtils that takes a geometry and an array of materials. It will create a mesh for every material. It will save me some code calculation.
  // https://threejs.org/docs/#examples/en/utils/SceneUtils

  let mesh = THREE.SceneUtils.createMultiMaterialObject(
    new THREE.BoxGeometry(
      GameManager.gameBoxSize,
      GameManager.gameBoxSize,
      GameManager.gameBoxSize
    ),
    [
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        shading: THREE.FlatShading,
        wireframe: true,
        transparent: true,
      }),
      new THREE.MeshBasicMaterial({ color: GameManager.zColor[z] }),
    ]
  );

  // The game box is centered at the origin (0,0,0). So, some of the cubes will have negative or positive x,y,z values. I need to specify a corner of an object and think of box positions as value from n to n.
  // Three.hs has its own units that relate to meters or pixels. I use this formula above for the box for the conversion:  GameManager.gameBoxSize = gameBoxObj.width / gameBoxObj.segmentX
  // In the case below for the position: convert "n - n" to "-n - +n" (0 - 5 to -3 - +2):
  // (x - Tetris.boundingBoxConfig.splitX/2)
  // Then scale to Three.js units:
  // * GameManager.gameBoxSize
  // Shif position since we specify the cube center not its corner.
  // + GameManager.gameBoxSize / 2

  mesh.position.x =
    (x - GameManager.gameBoxObj.segmentX / 2) * GameManager.gameBoxSize +
    GameManager.gameBoxSize / 2;
  mesh.position.y =
    (y - GameManager.gameBoxObj.segmentY / 2) * GameManager.gameBoxSize +
    GameManager.gameBoxSize / 2;
  mesh.position.z =
    (z - GameManager.gameBoxObj.segmentZ / 2) * GameManager.gameBoxSize +
    GameManager.gameBoxSize / 2;
  mesh.overdraw = true; // This will allow the mesh to draw over the edges of the other mesh.

  GameManager.scene.add(mesh);
  GameManager.staticBlocks[x][y][z] = mesh; // Add the mesh to the staticBlocks array.
};

GameManager.init();

// ########################## SHAPES ##########################

GameManager.Utils = {};

// Method to create a copy of of a vector, since object are passed by reference and numbers by value, v1 = v2 will mean one vector only in memory. If I can access directly the numeric value of the vector and make a clone of it, I would have two vectors to manipulate indenpendently.
GameManager.Utils.cloneVector = function (vector) {
  return { x: vector.x, y: vector.y, z: vector.z };
};

// The shapes are defined as an array of vectors, each vector is a point of the shape.

GameManager.Box = {};

GameManager.Box.shapes = [
  // Every shape first cube should be [0,0,0]
  [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 1, y: 1, z: 0 },
    { x: 1, y: 2, z: 0 },
  ],
  [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 2, z: 0 },
  ],
  [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 1, y: 1, z: 0 },
  ],
  [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 2, z: 0 },
    { x: 1, y: 1, z: 0 },
  ],
  [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 1, y: 1, z: 0 },
    { x: 1, y: 2, z: 0 },
  ],
];

// Position and rotation of the shape. We use different units in the game box than Three.js. Will store the position separately ans use the built-in rotation.

GameManager.position = {};

// Generation of the shapes function
// ################# START Box.create function #################
GameManager.Box.create = function () {
  // Get a random shape form

  randomType = Math.floor(Math.random() * GameManager.Box.shapes.length);

  // Save this shape type in the game manager
  this.shapeRandomType = randomType;

  // Create a empty array, loop through the shapes array to copy a random shape with cloneVector function and assign it to that array.

  GameManager.Box.shape = [];

  for (let i = 0; i < GameManager.Box.shapes[type].length; i++) {
    GameManager.Box.shape.push(
      GameManager.Utils.cloneVector(GameManager.Box.shapes[type][i])
    );
  }

  // Connect all the cubes to one shape. Will use THREE.GeometryUtils.merge method for this. It will take a geometry and mesh and merge them together.
  let tempShape;
  let shape = new THREE.BoxGeometry(
    GameManager.gameBoxSize,
    GameManager.gameBoxSize,
    GameManager.gameBoxSize
  );

  // Loop through the shape array and assign the position of the cube to the shape.
  for (let i = 0; i < GameManager.Box.shape.length; i++) {
    tempShape = new THREE.Mesh(
      new THREE.BoxGeometry(
        GameManager.gameBoxSize,
        GameManager.gameBoxSize,
        GameManager.gameBoxSize
      ),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    tempShape.position.x = GameManager.gameBoxSize * GameManager.Box.shape[i].x;
    tempShape.position.y = GameManager.gameBoxSize * GameManager.Box.shape[i].y;
    tempShape.position.z = GameManager.gameBoxSize * GameManager.Box.shape[i].z;
    THREE.GeometryUtils.merge(shape, tempShape);
  }

  // After getting the merged shape geometry, will use the same method THREE.SceneUtils.createMultiMaterialObject used before for merging a geometry and array of materials.
  // https://threejs.org/docs/#examples/en/utils/SceneUtils

  GameManager.Box.mesh = THREE.SceneUtils.createMultiMaterialObject(shape, [
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      shading: THREE.FlatShading,
      wireframe: true,
      transparent: true,
    }),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
    }),
  ]);

  // Set the initial position and rotation of the shape.
  // Center of the game for x & y and n number for z.
  GameManager.Box.position = {
    x: Math.floor(GameManager.gameBoxObj.segmentX / 2) - 1,
    y: Math.floor(GameManager.gameBoxObj.segmentY / 2) - 1,
    z: 15,
  };

  GameManager.Box.position.x =
    ((GameManager.Box.position.x - gameBoxObj.segmentX / 2) *
      GameManager.gameBoxSize) /
    2;

  GameManager.Box.position.y =
    (GameManager.Box.position.y - gameBoxObj.segmentY / 2) *
    GameManager.gameBoxSize;

  GameManager.Box.position.z =
    (GameManager.Box.position.z - gameBoxObj.segmentz / 2) *
    GameManager.gameBoxSize;

  GameManager.Box.rotation = { x: 0, y: 0, z: 0 };
  GameManager.mesh.overdraw = true; // This will allow the mesh to draw over the edges of the other mesh.

  GameManager.scene.add(GameManager.Box.mesh);
};
// Call the create function to create the shape.
GameManager.Box.create();
// ################# END Box.create function #################


