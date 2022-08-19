// Global object which will contain all the functions and variables, replicating so, the namespace in JavaScript. An example of anti-pattern, but will do for this small application.
let GameManager = {};

// Create Three.js objects, and store them in the globaj object GameManager.
GameManager.init = function () {
  // Fullscreen scene size
  const width = window.innerWidth; /
  const height = window.innerHeight;

  // Camera attributes
  const viewAngle = 45;
  const aspect = width / height;
  const near = 0.1;
  const far = 1000;
};

// Creating the scene, the camera and the renderer.

GameManager.renderer = new THREE.WebGLRenderer();
GameManager.renderer.setSize(width, height);

GameManager.scene = new THREE.Scene();
GameManager.camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
// Camera starts at (0, 0, 0) looking at (0, 0, -1) with an up vector of (0, 1, 0). So, we pull it back at:
GameManager.camera.position.z = 600;
GameManager.scene.add(GameManager.camera);

document.body.appendChild(GameManager.renderer.domElement); // Appending the renderer to the body of the document.
