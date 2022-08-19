import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";
import { MainGame } from "./MainGame";

class App {
  constructor() {
    this.canvas = document.getElementById("my-canvas");
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    this.scene.ambientColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    this.scene.fogDensity = 0.005;
    this.scene.fogColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    this.scene.fogStart = 0;
    this.scene.fogEnd = 100;
    this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    this.scene.collisionsEnabled = true;
    this.scene.workerCollisions = true;
    this.scene.collisionCoordinator = new BABYLON.CollisionCoordinatorWorker();
    this.scene.collisionCoordinator.init(this.scene);
    this.scene.collisionCoordinator.onCollide = function (collider, collided) {
      if (
        collider.getClassName() == "BoxMesh" &&
        collided.getClassName() == "BoxMesh"
      ) {
        collider.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        collided.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
      }
    };
    this.scene.debugLayer.show();
    this.scene.debugLayer.showAxis(10);
    this.scene.debugLayer.showBoundingBoxes = true;
    this.scene.debugLayer.showPhysicsProperties = true;
    this.scene.debugLayer.showPhysicsImposters = true;
  }
}

window.addEventListener("DOMContentLoaded", function () {});
