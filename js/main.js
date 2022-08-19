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
  GameManager.camera.position.z = 600;
  // Adding the camera to the scene.
  GameManager.scene.add(GameManager.camera);

  document.body.appendChild(GameManager.renderer.domElement); // Appending the renderer to the body of the document.

  // The game box attributes
  let gameBoxObj = {
    width: 500,
    height: 360,
    depth: 1200,
    // Number of boxes fitting inside the game box x,y,z axis
    segmentX: 6,
    segmentY: 6,
    segmentZ: 15,
  };

  GameManager.gameBoxObj = gameBoxObj;
  GameManager.gameBoxSize = gameBoxObj.width / gameBoxObj.segmentX;

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
    new THREE.MeshBasicMaterial({ color: "", wireframe: true }) //Seeing the wirefrme to draw the lines
  );
  // Adding the game box to the scene.
  GameManager.scene.add(gameBox);

  // Rendering
  GameManager.renderer.render(GameManager.scene, GameManager.camera);

  // Add an event listener to the play button.
  document
    .getElementById("play-button")
    .addEventListener("click", function (event) {
      event.preventDefault();
      GameManager.start();
    });

  // With the start() method: hide menu instructions and show the points. Also call animate() function.
  GameManager.start = function () {
    document.getElementById("menu").style.display = "none";
    GameManager.pointsElement = document.getElementById("points");
    GameManager.pointsElement.style.display = "block";

    GameManager.animate(); // Will use Window.requestAnimationFrame() to call the animate() function. animate() will call the render method and then call itself again using requestAnimationFrame().
    // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  };

  // window.requestAnimationFrame()
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function () {
      return (
        // Browser compatibility
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();
  }

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
};

window.addEventListener("load", GameManager.init);
