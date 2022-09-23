/*jshint esversion: 6 */
// @ts-check

/*
 * Graphics Town Example Objects
 *
 * Houses: Shiny Sculpture - the simplest possible dynamic environment map
 *
 * this works, but seems to generate a lot of WebGL warnings - not sure what to do
 * about that
 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { OBJLoader } from "../libs/CS559-Three/examples/jsm/loaders/OBJLoader.js";
let loader = new OBJLoader();
let Pole_num = 10;
let Horses = [];
for( let horse_idx = 0; horse_idx < Pole_num; horse_idx++ ){
  let horse = await loader.loadAsync( "./images/horse.obj" );
  horse.scale.set( 8e-4, 8e-4, 8e-4 );
  Horses.push( horse );
}

export class ShinySculpture extends GrObject {
  /**
   *
   * @param {GrWorld} world
   */
  constructor(world, radius=2) {
    let group = new T.Group();
    super("ShinySculpture", group);

    this.world = world;
    const cubeRenderTarget = new T.WebGLCubeRenderTarget( 128 );
    this.cubecam = new T.CubeCamera(radius*1.05, 1000, cubeRenderTarget);
    this.sculptureGeom = new T.SphereBufferGeometry(radius, 20, 10);
    this.sculptureMaterial = new T.MeshStandardMaterial({
      color: "white",
      roughness: 0.2,
      metalness: .7,
      // @ts-ignore   // envMap has the wrong type
      envMap: this.cubecam.renderTarget.texture,
    });
    this.sculpture = new T.Mesh(this.sculptureGeom, this.sculptureMaterial);
    group.add(this.cubecam);
    group.add(this.sculpture);

    group.translateY(radius*1.1);
  }

  stepWorld(delta, timeOfDay) {
    this.cubecam.update(this.world.renderer, this.world.scene);
  }
}
