/*jshint -W047,  esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";

let clothObCtr = 0;
// A colorful merry-go-round, with handles and differently-colored sections.
/**
 * @typedef ClothProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrCloth extends GrObject {
  /**
   * @param {ClothProperties} params
   */
  constructor(params = {}) {
    let clothBase = new T.Group();
    let clothMat = shaderMaterial("./12-cloth.vs", "./12-cloth.fs", {
                    side: T.DoubleSide, uniforms: { time: { value: 0.0 } } });
    let clothGeom = new T.PlaneGeometry( 4, 4, 64, 64 );
    let cloth = new T.Mesh( clothGeom, clothMat );
    clothBase.add( cloth );
    clothBase.rotation.x = - Math.PI / 8;

    super( `Cloth-${clothObCtr++}`, clothBase );
    this.clothMat = clothMat;
    this.wholeOb = clothBase;

    this.wholeOb.position.x = params.x ? Number(params.x) : 0;
    this.wholeOb.position.y = params.y ? Number(params.y) : 0;
    this.wholeOb.position.z = params.z ? Number(params.z) : 0;
    let s = params.size ? Number(params.size) : 1;
    clothBase.scale.set( s, s, s );
  }

  /**
   * StepWorld Method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld( delta, timeOfDay ){
    this.clothMat.uniforms.time.value += delta;
  }
}