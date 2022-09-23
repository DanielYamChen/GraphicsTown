/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

let simplecount = 0;

/**
 * Simple Park Object: A bouncing cube
 * Really boring, but shows how we keep track of time and set the state accordingly.
 *
 * Every second, the cube "jumps" up.
 */
export class SimpleBouncer extends GrObject {
  /**
   *
   * @param {Number} x
   * @param {Number} z
   */
  constructor(x, z) {
    let geom = new T.BoxGeometry();
    let mesh = new T.Mesh(geom, new T.MeshStandardMaterial({ color: "red" }));
    mesh.position.x = x;
    mesh.position.z = z;
    mesh.position.y = 0.5;
    super(`bouncer-${simplecount++}`, mesh);
    this.time = 0;
    this.mesh = mesh;
  }
  /**
   * The jumping behavior.
   *
   * Note how we keep track of time (advancing our internal clock based on the step).
   *
   * Time is used to do something each second (remember step is in milliseconds).
   * First, we wait for 1/10 of a second
   * Then, we jump up with a parabola
   * Then, we wait for 1/10 of a second
   *
   * Note that no matter what the time is, we set the animated variable appropriately
   *
   * The y=.5 minimum is because the cube has size 1, and we want it to sit on the ground
   * at the bottom of the jump
   *
   * @param {Number} step
   * @param {Number} [timeOfDay]
   */
   stepWorld(step, timeOfDay) {
    this.time += step / 1000; // time in seconds
    // set the y position based on the time
    let t = this.time % 1; // where are we in the cycle?

    if (t < 0.1 || t > 0.9) this.mesh.position.y = 0.5;
    else {
      this.mesh.position.y = 0.5 + 10 * (0.16 - (0.5 - t) * (0.5 - t));
    }
  }
}
