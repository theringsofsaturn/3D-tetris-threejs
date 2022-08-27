import {
  WebGLRenderer,
  PerspectiveCamera,
  BoxBufferGeometry,
  BufferGeometry,
  BoxGeometry,
  TextureLoader,
  TextGeometry,
  Texture,
  AmbientLight,
  PointLight,
  DirectionalLight,
  PointsMaterial,
  MeshBasicMaterial,
  Mesh,
  Points,
  Scene,
  Float32BufferAttribute,
} from "../vendors/three/build/three.module.js";

// import * as THREE from "../vendors/three/build/three.module.js";
// import { GLTFLoader } from "../vendors/three/examples/jsm/loaders/GLTFLoader.js";
// import * as THREE from 'https://cdn.skypack.dev/three@0.143.0/build/three.module.js';
// import {GLTFLoader} from "https://cdn.skypack.dev/three@0.143.0/examples/jsm/loaders/GLTFLoader.js";
// import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js";
// import { BufferGeometryUtils } from "https://unpkg.com/three@0.126.1/examples/jsm/utils/BufferGeometryUtils.js";

// import * as gui from "../node_modules/lil-gui/dist/lil-gui.esm.js";

// Global object which will contain all the functions and variables, replicating so, the namespace in JavaScript. An example of anti-pattern, but will do for this small application.

let GameManager = {};
GameManager.sounds = {};

// ######################### GAME INITIALIZATION #########################

// Creating Three.js objects, and storing them in the global object GameManager.

GameManager.init = function () {
  // Fullscreen scene size
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Camera attributes
  const viewAngle = 60;
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
  GameManager.camera.position.z = 500;
  GameManager.scene.add(GameManager.camera);

  // Starting the renderer
  GameManager.renderer.setSize(width, height);
  document.body.appendChild(GameManager.renderer.domElement); // Appending the renderer to the body of the document

  // The game box configuration
  let gameBoxConfiguration = {
    width: 360,
    height: 360,
    depth: 1200, // Change the depth accordingly when changing the Box size to it

    // Number of boxes fitting inside the game box x,y,z axis
    segmentX: 6,
    segmentY: 6,
    segmentZ: 20,
  };
  GameManager.gameBoxConfiguration = gameBoxConfiguration; // Storing the game box object in the global object GameManager.
  GameManager.boxSize =
    gameBoxConfiguration.width / gameBoxConfiguration.segmentX; // Three.js, WebGL, OpenGL have their own units that relate to meters or pixels. This formula is responsible for conversion.

  // Called before the boxes are displayed.
  GameManager.Board.init(
    gameBoxConfiguration.segmentX,
    gameBoxConfiguration.segmentY,
    gameBoxConfiguration.segmentZ
  );

  // -----------------------------------------------------
  // ############# Creating the game box #################
  // -----------------------------------------------------
  let gameBox = new THREE.Mesh(
    new THREE.CubeGeometry( // Since having some probems with Three modules in CDNs (some versions work and some don't.), if trying to import not only Three but other modules for controls, loaders Buffer geometry utils, etc. I will use another old version of Three that matches with no errors. Would work and match all modules if imported as node_modules but without webpack there will be issues to read multiple modules. With a newer BoxBufferGeometry, I would get triangles, so, diagonals. Using old CubeGeometry for now.
      gameBoxConfiguration.width,
      gameBoxConfiguration.height,
      gameBoxConfiguration.depth,
      gameBoxConfiguration.segmentX,
      gameBoxConfiguration.segmentY,
      gameBoxConfiguration.segmentZ
    ),
    new THREE.MeshBasicMaterial({ color: 0xfffff, wireframe: true })
  );
  GameManager.scene.add(gameBox);

  // Rendering the scene & camera
  GameManager.renderer.render(GameManager.scene, GameManager.camera);

  // -----------------------------------------------------
  // #################### Space particles ####################
  // ------------------------------------------------------------
  // Geometry is deprecated and no part of the library core anymore. Have have to use BufferGeometry. However, BufferGeometry has no vertices property since vertex data are managed in form of buffer attributes.
  // Information about this removal: https://discourse.threejs.org/t/three-geometry-will-be-removed-from-core-with-r125/22401
  // let starGeo = new BufferGeometry();
  // const vertices = [];

  // starGeo.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  // for (let i = 0; i < 6000; i++) {
  //   let star = new THREE.Vector3(
  //     Math.random() * 600 - 300,
  //     Math.random() * 600 - 300,
  //     Math.random() * 600 - 300
  //   );
  // star.velocity = 0;
  // star.acceleration = 0.02;
  //   vertices.push(star);
  // }

  // let sprite = new TextureLoader().load("white-circle.jfif");
  // let starMaterial = new PointsMaterial({
  //   color: 0xaaaaaa,
  //   size: 0.7,
  //   map: sprite,
  // });

  // let stars = new Points(starGeo, starMaterial);
  // GameManager.scene.add(stars);

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

  // Add an event listener to the play button.
  document
    .getElementById("play-button")
    .addEventListener("click", function (event) {
      event.preventDefault();
      GameManager.play();
      GameManager.sounds["theme"].play();
    });

  // Music & Audio
  GameManager.sounds["theme"] = document.getElementById("audio_theme");
  GameManager.sounds["score"] = document.getElementById("audio_score");
  GameManager.sounds["collision"] = document.getElementById("audio_collision");
  GameManager.sounds["move"] = document.getElementById("audio_move");
  GameManager.sounds["gameover"] = document.getElementById("audio_gameover");
};

// With the play() method: hide menu instructions, hide the 3D model Robo and show the score. Call the function to create boxes and also call animate() function.
GameManager.play = function () {
  document.getElementById("menu").style.display = "none";
  GameManager.scoreElement = document.getElementById("score");
  GameManager.scoreElement.style.display = "block";

  //Remove gltf model "roboModel" from the scene.
  // GameManager.scene.remove(GameManager.scene.getObjectByName("roboModel"));

  GameManager.Box.create();
  GameManager.animate(); // Will use Window.requestAnimationFrame() to call the animate() function. animate() will call the render method and then call itself again using requestAnimationFrame().
  // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
};

// ----------------------------------------------------------------------
// ################## Calculating when to move the block ################
// -----------------------------------------------------------------------
// Time variables

GameManager.gameStepTime = 1000; // The time in milliseconds between each step.

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
  // starGeo.vertices.forEach((p) => {
  //   p.velocity += p.acceleration;
  //   p.y -= p.velocity;

  //   if (p.y < -200) {
  //     p.y = 200;
  //     p.velocity = 0;
  //   }
  // });
  // starGeo.verticesNeedUpdate = true; // Update the vertices.
  // stars.rotation.y +=0.002; // Some cinematic effect.

  // Render the scene and the camera.
  GameManager.renderer.render(GameManager.scene, GameManager.camera);

  if (!GameManager.gameOver) window.requestAnimationFrame(GameManager.animate);
};

//-----------------------------------------------------
// In our game, cubes will be connected when are dynamic and static when they are not. Checking for collisions when the shape touches the floor or another shape. The moving block (with merged geometry of a few cubes) is transformed into static, separated cubes that don't move anymore. It's convenient to keep these cubes in a 3D array.

GameManager.staticBox = []; // Array to store the static blocks.

// Stores a list of colors to indicate the position of the cube on z axis.
GameManager.zColors = [
  0x6666ff, 0x66ffff, 0xcc68ee, 0x666633, 0x66ff66, 0x9966ff, 0x00ff66,
  0x66ee33, 0x003399, 0x330099, 0xffa500, 0x99ff00, 0xee1289, 0x71c671,
  0x00bfff, 0x666633, 0x669966, 0x9966ff,
];
GameManager.createStaticBlocks = function (x, y, z) {
  if (GameManager.staticBox[x] === undefined) GameManager.staticBox[x] = [];

  if (GameManager.staticBox[x][y] === undefined)
    GameManager.staticBox[x][y] = [];

  // Using a Three.js function SceneUtils that takes a geometry and an array of materials. It will create a mesh for every material. It will save me some code calculation.

  let mesh = THREE.SceneUtils.createMultiMaterialObject(
    new THREE.CubeGeometry(
      GameManager.boxSize,
      GameManager.boxSize,
      GameManager.boxSize
    ),
    [
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        shading: THREE.FlatShading,
        wireframe: true,
        transparent: true,
      }),
      new THREE.MeshBasicMaterial({ color: GameManager.zColors[z] }),
    ]
  );

  // The game box is centered at the origin (0,0,0). So, some of the cubes will have negative or positive x,y,z values. I need to specify a corner of an object and think of box positions as value from n to n.
  // Three.js has its own units that relate to meters or pixels. I use this formula above for the box for the conversion:  GameManager.gameBoxSize = gameBoxObj.width / gameBoxObj.segmentX
  // In the case below for the position: convert "n - n" to "-n - +n" (0 - 5 to -3 - +2):
  // (x - GameManager.gameBoxConfiguration.segmentX/2)
  // Then scale to Three.js units:
  // * GameManager.gameBoxSize
  // Shift position since we specify the cube center not its corner.
  // + GameManager.gameBoxSize / 2

  mesh.position.x =
    (x - GameManager.gameBoxConfiguration.segmentX / 2) * GameManager.boxSize +
    GameManager.boxSize / 2;
  mesh.position.y =
    (y - GameManager.gameBoxConfiguration.segmentY / 2) * GameManager.boxSize +
    GameManager.boxSize / 2;
  mesh.position.z =
    (z - GameManager.gameBoxConfiguration.segmentZ / 2) * GameManager.boxSize +
    GameManager.boxSize / 2;

  GameManager.scene.add(mesh);
  GameManager.staticBox[x][y][z] = mesh;
};

GameManager.currentPoints = 0;
GameManager.addPoints = function (n) {
  GameManager.currentPoints += n;
  GameManager.scoreElement.innerHTML = GameManager.currentPoints;
  GameManager.sounds["score"].play();
};

// GameManager.init();
window.addEventListener("load", GameManager.init);

// ############### GLTFLoader and 3D Models (Move to scene initialization when uncomment) ################################
// gltf loader for loading the model.
// GameManager.gltfLoader = new GLTFLoader();
// GameManager.gltfLoader.load("robo/scene.gltf", (gltf) => {
//   console.log("gltf model here:", gltf);
//   const roboModel = gltf.scene;
//   // Model scale
//   roboModel.scale.set(900, 900, 900);
//   // Model position
//   roboModel.position.set(25, -60, 253.37);
//   // Model rotation
//   roboModel.rotation.set(0, 0.5, 0);
//   // Model name
//   roboModel.name = "roboModel";

//   GameManager.scene.add(roboModel);
//   this.animate();
// });

// ################### Keyboard controls ################################
// Keyboard controls
// Keyboard controls
// Key name       event.which       event.key      event.code

// backspace      8                Backspace      Backspace
// tab            9                Tab            Tab
// enter          13               Enter          Enter
// shift          16                Shift          ShiftLeft
// ctrl           17                Control        ControlLeft
// alt(left)      18                Alt            AltLeft
// alt(right)     18                AltRight       AltRight
// pause          19                Pause          Pause
// caps lock      20                CapsLock       CapsLock
// escape         27                Escape         Escape
// -------------------------------------------------------------
// space          32                ""             Space        // Need this
// -------------------------------------------------------------
// page up        33                PageUp         PageUp
// page down      34                PageDown       PageDown
// end            35                End            End
// home           36                Home           Home
// ----------------------------------------------------------
// left arrow     37                ArrowLeft      ArrowLeft
// up arrow       38                ArrowUp        ArrowUp
// right arrow    39                ArrowRight     ArrowRight  // Need these
// down arrow     40                ArrowDown      ArrowDown
// ----------------------------------------------------------
// delete         46                Delete         Delete
// 0              48                0              Digit0
// 1              49                1              Digit1
// 2              50                2              Digit2
// 3              51                3              Digit3
// 4              52                4              Digit4
// 5              53                5              Digit5
// 6              54                6              Digit6
// 7              55                7              Digit7
// 8              56                8              Digit8
// 9              57                9              Digit9
// ----------------------------------------------------------
// a              65                a              KeyA       // Need this
// ----------------------------------------------------------
// b              66                b              KeyB
// c              67                c              KeyC
// ----------------------------------------------------------
// d              68                d              KeyD     // Need these
// e              69                e              KeyE
// ----------------------------------------------------------
// f              70                f              KeyF
// g              71                g              KeyG
// h              72                h              KeyH
// i              73                i              KeyI
// j              74                j              KeyJ
// k              75                k              KeyK
// l              76                l              KeyL
// m              77                m              KeyM
// n              78                n              KeyN
// o              79                o              KeyO
// p              80                p              KeyP
// ----------------------------------------------------------
// q              81                q              KeyQ     // Need this
// ----------------------------------------------------------
// r              82                r              KeyR
// ----------------------------------------------------------
// s              83                s              KeyS     // Need this
// ----------------------------------------------------------
// t              84                t              KeyT
// u              85                u              KeyU
// v              86                v              KeyV
// ----------------------------------------------------------
// w              87                w              KeyW       // Need this
// ----------------------------------------------------------
// x              88                x              KeyX
// y              89                y              KeyY
// z              90                z              KeyZ

// #################################################################

window.addEventListener("keydown", function (event) {
  console.log("keydown:", event.which);
  // switch case to check the keydown event and get the keys

  switch (event.which || event.keyCode) {
    case 37: // left arrow key
      GameManager.Box.move(-1, 0, 0);
      break;
    case 38: // up arrow key
      GameManager.Box.move(0, 1, 0);
      break;
    case 39: // right arrow key
      GameManager.Box.move(1, 0, 0);
      break;
    case 40: // down arrow key
      GameManager.Box.move(0, -1, 0);
      break;
    case 32: // space bar
      GameManager.Box.move(0, 0, -1);
      break;
    case 87: // w key
      GameManager.Box.rotate(90, 0, 0);
    case 27: // escape key
      GameManager.Box.rotate(0, 0, 0);
      break;
    case 65: // a key
      GameManager.Box.rotate(0, 0, 90);
      break;
    case 83: // s key
      GameManager.Box.rotate(-90, 0, 0);
      break;
    case 68: // d key
      GameManager.Box.rotate(0, 0, -90);
      break;
  }
  false;
});

// ------------------------------------------------------------
// ########################## SHAPES ##########################
// ------------------------------------------------------------

GameManager.Utils = {};

// Method to create a copy of of a vector, since object are passed by reference and numbers by value, v1 = v2 will mean one vector only in memory. If I can access directly the numeric value of the vector and make a clone of it, I would have two vectors to manipulate indenpendently.

GameManager.Utils.cloneVector = function (vector) {
  return { x: vector.x, y: vector.y, z: vector.z };
};

// matrix-vector multiplication can result in decimal values. For that we need a method to round values.
GameManager.Utils.roundVector = function (vector) {
  vector.x = Math.round(vector.x);

  vector.y = Math.round(vector.y);

  vector.z = Math.round(vector.z);
};

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

// ------------------------------------------------------------------
// Position and rotation of the shape. We use different units in the game box than Three.js. Will store the position separately and use the built-in rotation.
GameManager.Box.position = {};

// ---------------------------------------------------------------
// ################# START Box.create function #################
//----------------------------------------------------------------
// Function to create the shapes.
GameManager.Box.create = function () {
  let geometry, geometry2;

  let type = Math.floor(Math.random() * GameManager.Box.shapes.length);
  this.boxType = type;

  GameManager.Box.shape = [];
  for (let i = 0; i < GameManager.Box.shapes[type].length; i++) {
    GameManager.Box.shape[i] = GameManager.Utils.cloneVector(
      GameManager.Box.shapes[type][i]
    );
  }

  // Merge all cubes in one shape. Will use the built-in Three method merge. It will merge the vertices in the array. It will also consider the position of the merged geometry. Meshes has a position but geometries don't. It's supposed to be always 0,0,0. This why the first cube is [0,0,0].

  geometry = new THREE.CubeGeometry(
    GameManager.boxSize,
    GameManager.boxSize,
    GameManager.boxSize
  );
  for (let i = 1; i < GameManager.Box.shape.length; i++) {
    geometry2 = new THREE.Mesh(
      new THREE.CubeGeometry(
        GameManager.boxSize,
        GameManager.boxSize,
        GameManager.boxSize
      )
    );
    geometry2.position.x = GameManager.boxSize * GameManager.Box.shape[i].x;
    geometry2.position.y = GameManager.boxSize * GameManager.Box.shape[i].y;
    THREE.GeometryUtils.merge(geometry, geometry2); // Merge them together.
  }

  // After getting the merged shape geometry, will use again the method THREE.SceneUtils.createMultiMaterialObject for two materials. One for the color and one for the transparent.
  GameManager.Box.mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      shading: THREE.FlatShading,
      wireframe: true,
      transparent: true,
    }),
    new THREE.MeshBasicMaterial({ color: 0xfffff }),
  ]);

  // Setting the initial position. Center for x and y and n number for z.
  GameManager.Box.position = {
    x: Math.floor(GameManager.gameBoxConfiguration.segmentX / 2) - 1,
    y: Math.floor(GameManager.gameBoxConfiguration.segmentY / 2) - 1,
    z: 15,
  };

  // Do a collision check immediately after creating the shape.
  if (
    GameManager.Board.collisionCheckAtStart(true) ===
    GameManager.Board.collision.floor
  ) {
    GameManager.gameOver = true;
    GameManager.scoreElement.innerHTML = "Game Over";
    GameManager.sounds["gameover"].play();
  }

  GameManager.Box.mesh.position.x =
    ((GameManager.Box.position.x -
      GameManager.gameBoxConfiguration.segmentX / 2) *
      GameManager.boxSize) /
    2;
  GameManager.Box.mesh.position.y =
    ((GameManager.Box.position.y -
      GameManager.gameBoxConfiguration.segmentY / 2) *
      GameManager.boxSize) /
    2;
  GameManager.Box.mesh.position.z =
    (GameManager.Box.position.z -
      GameManager.gameBoxConfiguration.segmentZ / 2) *
      GameManager.boxSize +
    GameManager.boxSize / 2;
  GameManager.Box.mesh.rotation = { x: 0, y: 0, z: 0 };
  GameManager.Box.mesh.overdraw = true;

  GameManager.scene.add(GameManager.Box.mesh);
};

// It's cleaner and more readable to have rotation and position separated. It will also help with collision detection.
// Rotation function. To rotate lets use the built-in methods, and convert angles to radians.
GameManager.Box.rotate = function (x, y, z) {
  GameManager.Box.mesh.rotation.x += (x * Math.PI) / 180;
  GameManager.Box.mesh.rotation.y += (y * Math.PI) / 180;
  GameManager.Box.mesh.rotation.z += (z * Math.PI) / 180;

  // Create a rotation matrix and multiply it with each vector of the shape to deal with Three rotation.
  let rotationMatrix = new THREE.Matrix4();
  rotationMatrix.setRotationFromEuler(GameManager.Box.mesh.rotation);

  for (let i = 0; i < GameManager.Box.shape.length; i++) {
    GameManager.Box.shape[i] = rotationMatrix.multiplyVector3(
      GameManager.Utils.cloneVector(GameManager.Box.shapes[this.boxType][i])
    );
    GameManager.Utils.roundVector(GameManager.Box.shape[i]); // Fields is an array with integer indexes. matrix-vector multiplication can return a vector with decimal values. We create a round fucntion in GameManager.Utils to round the values.
  }

  if (
    GameManager.Board.collisionCheckAtStart(false) ===
    GameManager.Board.collision.floor
  ) {
    GameManager.Box.rotate(-x, -y, -z);
  }
};

// Move function.
GameManager.Box.move = function (x, y, z) {
  GameManager.Box.mesh.position.x += x * GameManager.boxSize;
  GameManager.Box.position.x += x;

  GameManager.Box.mesh.position.y += y * GameManager.boxSize;
  GameManager.Box.position.y += y;

  GameManager.Box.mesh.position.z += z * GameManager.boxSize;
  GameManager.Box.position.z += z;

  // After changing the position, do a collision check, passing info about z axis as an argument.
  let collisionCheck = GameManager.Board.collisionCheckAtStart(z != 0);

  // If there's a collision with the wall or the floor, move the box back. Zero for z axis because it will not be used for this check.
  if (collisionCheck === GameManager.Board.collision.wall) {
    GameManager.Box.move(-x, -y, 0);
  }

  if (collisionCheck === GameManager.Board.collision.floor) {
    GameManager.Box.grounded();
    GameManager.sounds["collision"].play();
    GameManager.Board.checkCompleted();
  } else {
    GameManager.sounds["move"].play();
  }
  // If the box is on the ground, call the landed function. It means it should no longer move, so we convert it to static, remove it from the scene and create a new one.
};

// Called when the box is on the ground. It will be converted to static box, remove from the scene and create a new one.
GameManager.Box.solidify = function () {
  let shape = GameManager.Box.shape;

  for (let i = 0; i < shape.length; i++) {
    GameManager.createStaticBlocks(
      GameManager.Box.position.x + shape[i].x,
      GameManager.Box.position.y + shape[i].y,
      GameManager.Box.position.z + shape[i].z
    );

    // Store information in the array.
    GameManager.Board.fields[GameManager.Box.position.x + shape[i].x][
      GameManager.Box.position.y + shape[i].y
    ][GameManager.Box.position.z + shape[i].z] =
      GameManager.Board.field.solidified;
  }
};

GameManager.Box.grounded = function () {
  GameManager.Box.solidify();
  GameManager.scene.removeObject(GameManager.Box.mesh);
  GameManager.Box.create();
};

// ---------------------------------------------------------------
// ################# Game Board & Collision ################################
// ---------------------------------------------------------------

GameManager.Board = {};

GameManager.Board.collision = { no: 0, wall: 1, floor: 2 };
// Object.freeze(GameManager.Board.collision);

GameManager.Board.field = { empty: 0, active: 1, solidified: 2 };
// Object.freeze(GameManager.Board.fields);

GameManager.Board.fields = [];

// GameManager.Board.init will be called before the boxes are displayed in the game. We call it in the GameManager.init function.
GameManager.Board.init = function (_x, _y, _z) {
  for (let x = 0; x < _x; x++) {
    GameManager.Board.fields[x] = [];

    for (let y = 0; y < _y; y++) {
      GameManager.Board.fields[x][y] = [];

      for (let z = 0; z < _z; z++) {
        GameManager.Board.fields[x][y][z] = GameManager.Board.field.empty;
      }
    }
  }
};

// ############### Collision Detection ###############################

// There are two kind of collisions. One is the wall collision (when it hits the wall or another box), and the other is the floor collision (when it hits the floor or another box).

GameManager.Board.collisionCheckAtStart = function (isGrounded) {
  let x;
  let y;
  let z;
  let i;

  let fields = GameManager.Board.fields;
  let positionX = GameManager.Box.position.x;
  let positionY = GameManager.Box.position.y;
  let positionZ = GameManager.Box.position.z;
  let shape = GameManager.Box.shape;

  for (i = 0; i < shape.length; i++) {
    // Detection for the 4 faces of the box.
    if (
      shape[i].x + positionX < 0 ||
      shape[i].y + positionY < 0 ||
      shape[i].x + positionX >= fields.length ||
      shape[i].y + positionY >= fields[0].length
    ) {
      return GameManager.Board.collision.wall;
    }

    // We store the solidified boxes in the array, in this way we can check if the box is intersecting with another box.
    if (
      fields[shape[i].x + positionX][shape[i].y + positionY][
        shape[i].z + positionZ - 1
      ] === GameManager.Board.field.solidified
    ) {
      // The collision with other boxes is detected the same way as the collision with the wall and the floor. What changes is the movement on the z axis that will hit the bottom of the box. We can use this check.
      return isGrounded
        ? GameManager.Board.collision.floor
        : GameManager.Board.collision.wall;
    }

    // Need to check if the z axis position is less or equal to 0, which means the box is grounded and should not move.
    if (shape[i].z + positionZ <= 0) return GameManager.Board.collision.floor;
  }
};

GameManager.Board.checkCompleted = function () {
  let x,
    y,
    z,
    x2,
    y2,
    z2,
    fields = GameManager.Board.fields;
  let rebuild = false;

  let sum,
    expected = fields[0].length * fields.length,
    bonus = 0;

  for (z = 0; z < fields[0][0].length; z++) {
    sum = 0;
    for (y = 0; y < fields[0].length; y++) {
      for (x = 0; x < fields.length; x++) {
        if (fields[x][y][z] === GameManager.Board.field.solidified) sum++;
      }
    }

    if (sum == expected) {
      bonus += 1 + bonus;

      for (y2 = 0; y2 < fields[0].length; y2++) {
        for (x2 = 0; x2 < fields.length; x2++) {
          for (z2 = z; z2 < fields[0][0].length - 1; z2++) {
            GameManager.Board.fields[x2][y2][z2] = fields[x2][y2][z2 + 1];
          }
          GameManager.Board.fields[x2][y2][fields[0][0].length - 1] =
            GameManager.Board.field.empty;
        }
      }
      rebuild = true;
      z--;
    }
  }
  if (bonus) {
    GameManager.addPoints(1000 * bonus);
  }
  if (rebuild) {
    for (let z = 0; z < fields[0][0].length - 1; z++) {
      for (let y = 0; y < fields[0].length; y++) {
        for (let x = 0; x < fields.length; x++) {
          if (
            fields[x][y][z] === GameManager.Board.field.solidified &&
            !GameManager.staticBlocks[x][y][z]
          ) {
            GameManager.addStaticBlock(x, y, z);
          }
          if (
            fields[x][y][z] == GameManager.Board.field.empty &&
            GameManager.staticBlocks[x][y][z]
          ) {
            GameManager.scene.removeObject(GameManager.staticBlocks[x][y][z]);
            GameManager.staticBlocks[x][y][z] = undefined;
          }
        }
      }
    }
  }
};
