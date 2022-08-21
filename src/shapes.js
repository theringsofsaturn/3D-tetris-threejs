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
