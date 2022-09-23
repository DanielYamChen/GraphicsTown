/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as SimpleObjects from "../libs/CS559-Framework/SimpleObjects.js";

let mydiv = document.getElementById("div1");

let world = new GrWorld({ width: mydiv ? 600 : 800, where: mydiv });

// use the code snippet from "readCubeTexture.js"
/**
 * Read in a set of textures from HDRI Heaven, as converted by 
 * https://www.360toolkit.co/convert-spherical-equirectangular-to-cubemap
 * 
 * this uses a specific naming convention, and seems to (usually) swap bottom and front,
 * so I provide to undo this
 * 
 * @param {string} name 
 * @param {string} [ext="png"]
 * @param {boolean} [swapBottomFront=true]
 */
 function cubeTextureHelp( name, format="png", swapBottomFront=true) {
  return new T.CubeTextureLoader().load([
      name + "_Right." + format,
      name + "_Left." + format,
      name + "_Top."  + format,
      name + ( swapBottomFront ? "_Front."  : "_Bottom.") + format,
      name + "_Back." + format,
      name + ( swapBottomFront ? "_Bottom." : "_Front.") + format
  ]);
}
let bg_texture = cubeTextureHelp( "./images/background", "jpg", false );
world.scene.background = bg_texture;
let bumpPattern = new T.TextureLoader().load( "./images/pattern__.png" );

let matBump = new T.MeshStandardMaterial({ metalness: 1.0, roughness: 0, envMap: bg_texture,
                                           bumpMap: bumpPattern, side: T.DoubleSide });
// let reflectMat = new T.MeshBasicMaterial( { envMap: bg_texture } );
let ball = new SimpleObjects.GrSphere( { x: 2, y: 2, material: matBump } );
world.add( ball );

let square = new SimpleObjects.GrSquareSign({ x: -2, y: 2, size: 1, material: matBump });
world.add( square );

world.go();
