// import Three.js modulesGLTFLoader
// import * as THREE from "../vendors/three/build/three.module.js";
// import { GLTFLoader } from "../vendors/three/examples/jsm/loaders/GLTFLoader.js";
// import * as THREE from 'https://cdn.skypack.dev/three@0.143.0/build/three.module.js';
// import {GLTFLoader} from "https://cdn.skypack.dev/three@0.143.0/examples/jsm/loaders/GLTFLoader.js";
// import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
// import { GLTFLoader } from "https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js";
// import { BufferGeometryUtils } from "https://unpkg.com/three@0.126.1/examples/jsm/utils/BufferGeometryUtils.js";

// import * as gui from "../node_modules/lil-gui/dist/lil-gui.esm.js";

// Global object which will contain all the functions and variables, replicating so, the namespace in JavaScript. An example of anti-pattern, but will do for this small application.

let GameManager = {};

// ######################### GAME INITIALIZATION #########################

// Creating Three.js objects, and storing them in the globaj object GameManager.
GameManager.init = function () {
  // Fullscreen scene size
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Camera attributes
  const viewAngle = 70;
  const aspect = width / height;
  const near = 0.1;
  const far = 10000;

  // Creating the scene, the camera and the renderer.
  GameManager.renderer = new THREE.WebGLRenderer();
  GameManager.camera = new THREE.PerspectiveCamera(
    viewAngle,
    aspect,
    near,
    far
  );
  GameManager.scene = new THREE.Scene();

  // Camera starts at (0, 0, 0) looking at (0, 0, -1) with an up vector of (0, 1, 0). So, I pull it back at:
  GameManager.camera.position.z = 700;
  GameManager.scene.add(GameManager.camera);

  // Starting the renderer
  GameManager.renderer.setSize(width, height);
  document.body.appendChild(GameManager.renderer.domElement); // Appending the renderer to the body of the document.

  // The game box attributes
  let gameBoxObj = {
    width: 1000,
    height: 700,
    depth: 1200,
    // Number of boxes fitting inside the game box x,y,z axis
    segmentX: 6,
    segmentY: 6,
    segmentZ: 20,
  };

  GameManager.gameBoxObj = gameBoxObj; // Storing the game box object in the global object GameManager.

  // Size of each box in the game box will be the width of the game box divided by the number of boxes in the axis.
  GameManager.gameBoxSize = gameBoxObj.width / gameBoxObj.segmentX; // Three.js, WebGL, OpenGL have their own units that relate to meters or pixels. This formula is responsible for conversion.

  // Creating the game box.
  let gameBox = new THREE.Mesh(
    new THREE.CubeGeometry(
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

  // Rendering
  GameManager.renderer.render(GameManager.scene, GameManager.camera);

  // Change the scene background color.
  // GameManager.scene.background = new THREE.Color(0xff0000 );
  // Set a background image for the scene.
  // GameManager.scene.background = new THREE.TextureLoader().load(
  //   "https://png.pngtree.com/thumb_back/fw800/background/20210312/pngtree-colorful-tetris-lego-blocks-background-image_584426.jpg"
  // ); // Will use drawing lines instead of a texture.

  // Add an event listener to the play button.
  document
    .getElementById("play-button")
    .addEventListener("click", function (event) {
      event.preventDefault();
      GameManager.play();
    });
};

// With the play() method: hide menu instructions, hide the 3D model Robo and show the score. Also call animate() function.
GameManager.play = function () {
  document.getElementById("menu").style.display = "none";
  GameManager.pointsElement = document.getElementById("points");
  GameManager.pointsElement.style.display = "block";

  //Remove gltf model "roboModel" from the scene.
  // GameManager.scene.remove(GameManager.scene.getObjectByName("roboModel"));

  GameManager.Box.create(); // function to create shapes

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
  while (GameManager.currentFrameTime > GameManager.gameStepTime) {
    GameManager.currentFrameTime -= GameManager.gameStepTime;
    GameManager.Box.move(0, 0, -1);
  }

  // Render the scene.
  GameManager.renderer.render(GameManager.scene, GameManager.camera);
  // Change canva color from white to black
  GameManager.renderer.setClearColorHex(0x000000, 1);

  // If the game is not over, then call the animate() function again.
  if (!GameManager.gameOver) {
    window.requestAnimationFrame(GameManager.animate);
  }
};

// In our game, cubes will be connected when are dynamic and static when they are not. Checking for collisions when the shape touches the floor or another shape. The moving block (with merged geometry of a few cubes) is transformed into static, separated cubes that don't move anymore. It's convenient to keep these cubes in a 3D array.

GameManager.staticBlocks = []; // Array to store the static blocks.

// Stores a list of colors to indicate the position of the cube on z axis.
GameManager.zColor = [
  0x6666ff, 0x66ffff, 0xcc68ee, 0x666633, 0x66ff66, 0x9966ff, 0x00ff66,
  0x66ee33, 0x003399, 0x330099, 0xffa500, 0x99ff00, 0xee1289, 0x71c671,
  0x00bfff, 0x666633, 0x669966, 0x9966ff,
];

GameManager.createStaticBlocks = function (x, y, z) {
  if (GameManager.staticBlocks[x] === undefined)
    GameManager.staticBlocks[x] = [];

  if (GameManager.staticBlocks[x][y] === undefined)
    GameManager.staticBlocks[x][y] = [];

  // Using a Three.js function SceneUtils that takes a geometry and an array of materials. It will create a mesh for every material. It will save me some code calculation.
  // https://threejs.org/docs/#examples/en/utils/SceneUtils

  let mesh = THREE.SceneUtils.createMultiMaterialObject(
    new THREE.CubeGeometry(
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
  // (x - GameManager.gameBoxObj.segmentX/2)
  // Then scale to Three.js units:
  // * GameManager.gameBoxSize
  // Shift position since we specify the cube center not its corner.
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

  GameManager.scene.add(mesh);
  GameManager.staticBlocks[x][y][z] = mesh;
};

GameManager.currentPoints = 0;
GameManager.addPoints = function (n) {
  GameManager.currentPoints += n;
  GameManager.pointsDOM.innerHTML = GameManager.currentPoints;
};

GameManager.init();

// Keyboard input
window.addEventListener(
  "keydown",
  function (event) {
    let key = event.code ? event.code : event.key;

    switch (key) {
      //case

      case 38: // up (arrow)
        GameManager.Box.move(0, 1, 0);
        break;
      case 40: // down (arrow)
        GameManager.Box.move(0, -1, 0);
        break;
      case 37: // left(arrow)
        GameManager.Box.move(-1, 0, 0);
        break;
      case 39: // right (arrow)
        GameManager.Box.move(1, 0, 0);
        break;
      case 32: // space
        GameManager.Box.move(0, 0, -1);
        break;

      case 87: // up (w)
        GameManager.Box.rotate(90, 0, 0);
        break;
      case 83: // down (s)
        GameManager.Box.rotate(-90, 0, 0);
        break;

      case 65: // left(a)
        GameManager.Box.rotate(0, 0, 90);
        break;
      case 68: // right (d)
        GameManager.Box.rotate(0, 0, -90);
        break;

      case 81: // (q)
        GameManager.Box.rotate(0, 90, 0);
        break;
      case 69: // (e)
        GameManager.Box.rotate(0, -90, 0);
        break;
    }
  },
  false
);

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
GameManager.Box.position = {};

// Generation of the shapes function
// ---------------------------------------------------------------
// ################# START Box.create function #################
//----------------------------------------------------------------

GameManager.Box.create = function () {
  let geometry, geometry2;

  let type = Math.floor(Math.random() * GameManager.Box.shapes.length);
  this.blockType = type;

  GameManager.Box.shape = [];
  for (var i = 0; i < GameManager.Box.shapes[type].length; i++) {
    GameManager.Box.shape[i] = GameManager.Utils.cloneVector(
      GameManager.Box.shapes[type][i]
    );
  }

  // Merge all cubes in one shape. Will use the built-in Three method merge. It will merge the vertices in the array. It will also consider the position of the merged geometry. Meshes has a position but geometries don't. It's supposed to be always 0,0,0. This why the first cube is [0,0,0].
  geometry = new THREE.CubeGeometry(
    GameManager.gameBoxSize,
    GameManager.gameBoxSize,
    GameManager.gameBoxSize
  );
  for (let i = 1; i < GameManager.Box.shape.length; i++) {
    geometry2 = new THREE.Mesh(
      new THREE.CubeGeometry(
        GameManager.gameBoxSize,
        GameManager.gameBoxSize,
        GameManager.gameBoxSize
      )
    );
    geometry2.position.x = GameManager.gameBoxSize * GameManager.Box.shape[i].x;
    geometry2.position.y = GameManager.gameBoxSize * GameManager.Box.shape[i].y;

    THREE.GeometryUtils.merge(geometry, geometry2); // Merge them together
  }

  // After getting the merged shape geometry, will use again the method THREE.SceneUtils.createMultiMaterialObject for two materials. One for the color and one for the transparent.
  GameManager.Box.mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [
    new THREE.MeshBasicMaterial({
      color: 0xff0000,
      shading: THREE.FlatShading,
      wireframe: true,
      transparent: true,
    }),
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
  ]);

  // Setting the initial position. Center for x and y and n number for z.
  GameManager.Box.position = {
    x: Math.floor(GameManager.gameBoxObj.segmentX / 2) - 1,
    y: Math.floor(GameManager.gameBoxObj.segmentY / 2) - 1,
    z: 15,
  };

  GameManager.Box.mesh.position.x =
    ((GameManager.Box.position.x - GameManager.gameBoxObj.segmentX / 2) *
      GameManager.gameBoxSize) /
    2;
  GameManager.Box.mesh.position.y =
    ((GameManager.Box.position.y - GameManager.gameBoxObj.segmentY / 2) *
      GameManager.BoxSize) /
    2;
  GameManager.Box.mesh.position.z =
    (GameManager.Box.position.z - GameManager.gameBoxObj.segmentZ / 2) *
      GameManager.gameBoxSize +
    GameManager.gameBoxSize / 2;
  GameManager.Box.mesh.rotation = { x: 0, y: 0, z: 0 };
  GameManager.Box.mesh.overdraw = true;

  GameManager.scene.add(GameManager.Box.mesh);
};

// It's cleaner and more readable to have rotation and position separated. It will also help with collision detection.
// Rotation function. To rotate lets use the built-in methods, and convert angles to radians.
GameManager.Box.rotate = function (x, y, z) {
  GameManager.Box.mesh.rotation.x += (x * Math.PI) / 180; // Convert to radians
  GameManager.Box.mesh.rotation.y += (y * Math.PI) / 180;
  GameManager.Box.mesh.rotation.z += (z * Math.PI) / 180;
};

// Move function.
GameManager.Box.move = function (x, y, z) {
  GameManager.Box.mesh.position.x += x * GameManager.gameBoxSize;
  GameManager.Box.position.x += x;

  GameManager.Box.mesh.position.y += y * GameManager.gameBoxSize;
  GameManager.Box.position.y += y;

  GameManager.Box.mesh.position.z += z * GameManager.gameBoxSize;
  GameManager.Box.position.z += z;
  if (GameManager.Box.position.z == 0) GameManager.Box.landedBox(); // If the box is on the ground, call the landed function. It means it should no longer move, so we convert it to static, remove it from the scene and create a new one.
};

// Called when the box is on the ground. It will be converted to static box, remove from the scene and create a new one.
GameManager.Box.harden = function () {
  let shape = GameManager.Box.shape;
  for (let i = 0; i < shape.length; i++) {
    GameManager.createStaticBlocks(
      GameManager.Box.position.x + shape[i].x,
      GameManager.Box.position.y + shape[i].y,
      GameManager.Box.position.z + shape[i].z
    );
  }
};

GameManager.Box.landedBox = function () {
  GameManager.Box.harden();
  GameManager.scene.removeObject(GameManager.Box.mesh);
  GameManager.Box.create();
};
