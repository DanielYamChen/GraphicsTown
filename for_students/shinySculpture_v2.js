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
// mainly copied from the example file, except modifying the geometry

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { OBJLoader } from "../libs/CS559-Three/examples/jsm/loaders/OBJLoader.js";
let loader = new OBJLoader();
let lion = await loader.loadAsync( "./images/lion.obj" );
lion.rotation.x = - Math.PI / 2;
lion.scale.set( 0.2, 0.2, 0.2 );

export class ShinySculpture extends GrObject {
  /**
   *
   * @param {GrWorld} world
   */
  constructor(world, params={}) {
    let group = new T.Group();
    super("ShinyLion-0", group);

    this.world = world;
    const cubeRenderTarget = new T.WebGLCubeRenderTarget( 128 );
    this.cubecam = new T.CubeCamera(4*1.05, 1000, cubeRenderTarget);
    // this.sculptureGeom = new T.SphereBufferGeometry(radius, 20, 10);
    this.sculptureMaterial = new T.MeshStandardMaterial({
      color: "white",
      roughness: 0.0,
      metalness: 1.0,
      // @ts-ignore   // envMap has the wrong type
      envMap: this.cubecam.renderTarget.texture,
    });
    let sculptureMaterial = this.sculptureMaterial;
    lion.children.forEach( function( child ){
      child.material = sculptureMaterial;
    });
    this.sculpture = lion;
    
    // this.sculpture = new T.Mesh(this.sculptureGeom, this.sculptureMaterial);
    group.add(this.cubecam);
    group.add(this.sculpture);

    group.position.x = params.x ? Number(params.x) : 0;
    group.position.y = params.y ? Number(params.y) : 0;
    group.position.z = params.z ? Number(params.z) : 0;
  }

  stepWorld(delta, timeOfDay) {
    this.cubecam.update(this.world.renderer, this.world.scene);
  }
}
