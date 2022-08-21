Gamemanager.Utils = {};

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
};
