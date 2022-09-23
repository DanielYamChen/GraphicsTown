/*jshint -W047,  esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

let fireworksObCtr = 0;
// A colorful merry-go-round, with handles and differently-colored sections.
/**
 * @typedef FireworksProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrFireworks extends GrObject {
  /**
   * @param {FireworksProperties} params
   */
  constructor(params = {}) {
    let fireworksScene = new T.Group();

    super( `Fireworks-${fireworksObCtr++}`, fireworksScene );
    this.ay = 0.0001;
    this.r_big = 0.2;
    this.r_small = 0.05;
    this.subfire_num = 20;
    this.fireworks = [];
    this.fireworksObj = [];
    this.fireworksScene = fireworksScene;

    this.wholeOb = fireworksScene;
    this.wholeOb.position.x = params.x ? Number(params.x) : 0;
    this.wholeOb.position.y = params.y ? Number(params.y) : 0;
    this.wholeOb.position.z = params.z ? Number(params.z) : 0;
    let s = params.size ? Number(params.size) : 1;
    fireworksScene.scale.set( s, s, s );
  }

  /**
   * StepWorld Method
   * @param {number} msX 
   * @param {number} msY 
   */
  pushBigFirework( msX, msY ){
    let x0 = Math.sign( msX ) * 20;
    let vy = Math.pow( 2 * this.ay * msY, 0.5 );
    let delta_t = - vy / this.ay;
    let vx = - ( msX - x0 ) / delta_t;
    let z = ( Math.random() - 0.5 ) * 40;
    // let vx = 0;
    let color = `rgb( ${(Math.random() * 255).toFixed(0)}, ${(Math.random() * 255).toFixed(0)}, ${(Math.random() * 255).toFixed(0)})`;

    let fireGeom = new T.SphereGeometry( this.r_big, 4, 4 );
    let fireMat = new T.MeshStandardMaterial({ color: color });
    let fire = new T.Mesh( fireGeom, fireMat );
    this.fireworks.push( { "x": x0, "y": 0, "z": z, "vx": vx, "vy": vy, "t": 0, "alpha": 1.0,
                           "r": this.r_big, "color": color, "big": true, "explode": false } );
    this.fireworksObj.push( fire );
    this.fireworksScene.add( this.fireworksObj[this.fireworksObj.length-1] );
  }

  /**
   * StepWorld Method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld( delta, timeOfDay ){

    // this.fireworks.forEach( function( firework ){
    for( let idx = 0; idx < this.fireworks.length; idx++ ){
      this.fireworks[idx].x += this.fireworks[idx].vx * delta;
      this.fireworks[idx].y += this.fireworks[idx].vy * delta;
      this.fireworks[idx].vy -= this.ay * delta;
      this.fireworks[idx].t++;
      
      if( this.fireworks[idx].big == false ){
        this.fireworks[idx].alpha -= this.fireworks[idx].t * 0.005;
      }

      if( this.fireworks[idx].vy < 0 && this.fireworks[idx].big == true &&
          this.fireworks[idx].explode == false ){
        this.fireworks[idx].explode = true;
      
        for(let i = 0; i < this.subfire_num; i++ ){
          let vx = Math.random() * 0.05 * Math.cos( i * 2 * Math.PI / this.subfire_num );
          let vy = Math.random() * 0.05 * Math.sin( i * 2 * Math.PI / this.subfire_num );
          let x = this.fireworks[idx].x + 0.05 * Math.cos( i * 2 * Math.PI / this.subfire_num );
          let y = this.fireworks[idx].y + 0.05 * Math.sin( i * 2 * Math.PI / this.subfire_num );
          let z = this.fireworks[idx].z;
          let color = `rgb( ${(Math.random() * 255).toFixed(0)}, ${(Math.random() * 255).toFixed(0)}, ${(Math.random() * 255).toFixed(0)})`;
          let fireGeom = new T.SphereGeometry( this.r_big, 4, 4 );
          let fireMat = new T.MeshStandardMaterial({ color: color });
          let fire = new T.Mesh( fireGeom, fireMat );
          this.fireworks.push( { "x": x, "y": y, "z": z, "vx": vx, "vy": vy, "t": 0, "alpha": 1.0,
                                  "r": this.r_small, "color": color, "big": false, "explode": false } );
          this.fireworksObj.push( fire );
          this.fireworksScene.add( this.fireworksObj[this.fireworksObj.length-1] );
        }
      }
    }
    
    for( let idx = 0; idx < this.fireworks.length; idx++ ){
      if( (this.fireworks[idx].y<-10) || (this.fireworks[idx].x<-30) || 
          (this.fireworks[idx].x> 30) || this.fireworks[idx].explode == true ||
          this.fireworks[idx].alpha < 0 ){
        this.fireworksScene.remove( this.fireworksObj[idx] );
        this.fireworks.splice( idx, 1 );
        this.fireworksObj.splice( idx, 1 );
      }
    }

    if( Math.random() < 0.01 ){
      this.pushBigFirework( Math.random() * 40 - 20, Math.random() * 10 + 10 );
    }

    for( let idx = 0; idx < this.fireworks.length; idx++ ){
      this.fireworksObj[idx].position.x = this.fireworks[idx].x;
      this.fireworksObj[idx].position.y = this.fireworks[idx].y;
    }
  }
}