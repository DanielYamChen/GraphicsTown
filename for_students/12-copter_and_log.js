/*jshint -W047,  esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
let woodPattern = new T.TextureLoader().load( "./images/wood.jfif" );

const CircleRes = 64;

let copterAndLogObCtr = 0;
// A colorful merry-go-round, with handles and differently-colored sections.
/**
 * @typedef CopterAndLogProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrCopterAndLog extends GrObject {
  /**
   * @param {CopterAndLogProperties} params
   */
  constructor(params = {}) {
    let copterAndLog = new T.Group();

    // create the helicopter
    let plane1 = new T.Group();
    let plane1Base = new T.Group();
    let plane1Propeller = new T.Group();
    let plane1BackPropeller = new T.Group();

    let plane1Material = new T.MeshStandardMaterial({color: "cyan",  metalness: 1.0, roughness: 1.0 });
    let plane1BodyShape = new T.CylinderGeometry( 5, 5, 10, CircleRes );
    let plane1Body = new T.Mesh( plane1BodyShape, plane1Material );

    let plane1FrontShape = new T.CylinderGeometry( 2, 5, 5, CircleRes );
    let plane1Front = new T.Mesh( plane1FrontShape, plane1Material );
    plane1Front.position.y = plane1BodyShape.parameters.height / 2 + plane1FrontShape.parameters.height / 2;

    let plane1BackShape = new T.CylinderGeometry( 5, 2, 5, CircleRes );
    let plane1Back = new T.Mesh( plane1BackShape, plane1Material );
    plane1Back.position.y = - plane1BodyShape.parameters.height / 2 - plane1BackShape.parameters.height / 2;

    let plane1TailShape = new T.CylinderGeometry( 2, 2, 10, CircleRes );
    let plane1Tail = new T.Mesh( plane1TailShape, plane1Material );
    plane1Tail.position.y = plane1Back.position.y - ( plane1BackShape.parameters.height + plane1TailShape.parameters.height ) / 2;

    let propellerShape = new T.BoxGeometry( 18, 0.5, 2 );
    let propellerMaterial = new T.MeshStandardMaterial({color: "brown",  metalness: 1., roughness: 1.0 });
    for( let i = 0; i < 4; i += 1 ){
        let temp = new T.Mesh( propellerShape, propellerMaterial );
        temp.rotation.y = Math.PI / 2 * i;
        temp.position.x = Math.cos( temp.rotation.y ) * propellerShape.parameters.width / 2;
        temp.position.z = Math.sin( temp.rotation.y ) * propellerShape.parameters.width / 2;
        temp.position.y = 1;
        if( i == 0 || i == 2 ){
            temp.rotation.x = Math.cos( temp.rotation.y ) * Math.PI / 12;
        } else if( i == 1 || i == 3 ){
            temp.rotateX( - Math.PI / 12 );
        }
        plane1Propeller.add( temp );
    }
    plane1Propeller.position.y = plane1BodyShape.parameters.radiusTop;
  
    for( let i = 0; i < 4; i += 1 ){
        let temp = new T.Mesh( propellerShape, propellerMaterial );
        temp.rotation.y = Math.PI / 2 * i;
        temp.position.x = Math.cos( temp.rotation.y ) * propellerShape.parameters.width / 2;
        temp.position.z = Math.sin( temp.rotation.y ) * propellerShape.parameters.width / 2;
        temp.position.y = 1;
        if( i == 0 || i == 2 ){
            temp.rotation.x = Math.cos( temp.rotation.y ) * Math.PI / 12;
        } else if( i == 1 || i == 3 ){
            temp.rotateX( - Math.PI / 12 );
        }
        plane1BackPropeller.add( temp );
    }
    plane1BackPropeller.position.x = plane1Tail.position.y - plane1TailShape.parameters.height / 3;
    plane1BackPropeller.position.z = - plane1TailShape.parameters.radiusTop * 1.5;
    plane1BackPropeller.rotation.x = Math.PI / 2;
    plane1BackPropeller.scale.set( 0.3, 0.3, 0.3 );

    plane1Base.add( plane1Body );
    plane1Base.add( plane1Front );
    plane1Base.add( plane1Back );
    plane1Base.add( plane1Tail );
    plane1Base.rotation.x = Math.PI / 2;
    plane1Base.rotation.z = - Math.PI / 2;
    plane1.add( plane1Base );
    plane1.add( plane1Propeller );
    plane1.add( plane1BackPropeller );
    plane1.scale.set( 0.25, 0.25, 0.25 );
    plane1.position.y = 15;
    plane1.position.x = 10;
    plane1.position.z = -10;

    super( `CopterAndLog-${copterAndLogObCtr++}`, copterAndLog );
    this.plane1 = plane1;
    this.plane1Propeller = plane1Propeller;
    this.plane1BackPropeller = plane1BackPropeller;
    this.rideable = plane1;
    
    // create 5 logs
    let logGeom = new T.CylinderGeometry( 0.5, 0.5, 1.75, CircleRes );
    let logMat = new T.MeshStandardMaterial({ map: woodPattern });
    let log_num = 8;
    let logs = [];
    for( let log_idx = 0; log_idx < log_num; log_idx++ ){
      let log = new T.Mesh( logGeom, logMat );      
      logs.push( log );
      copterAndLog.add( logs[log_idx] );
      // console.log( log.position.x, log.position.z );
    }
    this.logs = logs;
    this.resetLogs();
    
    // 0: uncollected, 1: transporting, 2: collected
    this.log_status = [ 0, 0, 0, 0, 0 ];
    // 0: enough height w/o load, 1: flying forward w/o load, 2: calibrate the angle,
    // 3: landing to collect the log,  
    this.copter_status = 0;
    this.targetID = 0;
    this.angle_err = 0.;
    this.dist = 0.;
    // this.attch_dist = 0.25 * plane1BodyShape.parameters.radiusTop + logGeom.parameters.radiusTop;
    this.attch_dist = 0.25 * plane1BodyShape.parameters.radiusTop + logGeom.parameters.radiusTop;
    this.fly_height = plane1.position.y;
    this.orgnl_x = plane1.position.x;
    this.orgnl_z = plane1.position.z;

    // put the object in its place
    copterAndLog.add( plane1 );
    this.wholeOb = copterAndLog;
    this.wholeOb.position.x = params.x ? Number(params.x) : 0;
    this.wholeOb.position.y = params.y ? Number(params.y) : 0;
    this.wholeOb.position.z = params.z ? Number(params.z) : 0;
    let s = params.size ? Number(params.size) : 1;
    copterAndLog.scale.set( s, s, s );
  }



  /**
   * @param {number} areaID
   */
  getRandomLocation( areaID ){
    if( areaID == 0 ){
      return [ Math.random() * 9 - 4.5, Math.random() * 4.5 + 15.5 ];
    } else if( areaID == 1 ){
      return [ Math.random() * 4.5 + 15.5, Math.random() * 9 - 4.5 ];
    } else if( areaID == 2 ){
      return [ Math.random() * 9 - 4.5, Math.random() * 4.5 - 20.0 ];
    } else{
      return [ Math.random() * 4.5 - 20.0, Math.random() * 9 - 4.5 ];
    }
  }

  resetLogs(){
    for( let log_idx = 0; log_idx < this.logs.length; log_idx++ ){
      [ this.logs[log_idx].position.x, this.logs[log_idx].position.z ] = this.getRandomLocation( log_idx%4 );
      this.logs[log_idx].rotation.y = Math.random() * Math.PI * 2;
      this.logs[log_idx].rotation.z = Math.PI / 2;
    }
  }


  /**
   * StepWorld Method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld( delta, timeOfDay ) {
    let Kp = 0.05;
    let rot_max = 0.1;
    let speed_max = 0.08;
    if( this.copter_status == 0 ){
      this.angle_err = Math.atan2( this.logs[this.targetID].position.z - this.plane1.position.z, this.logs[this.targetID].position.x - this.plane1.position.x );
      this.angle_err -= ( - this.plane1.rotation.y );
      if( Math.abs( this.angle_err ) >= 0.001 ){
        this.plane1.rotation.y -= Math.abs( Kp * this.angle_err ) > rot_max ? Math.sign( this.angle_err ) * rot_max : Kp * this.angle_err;
      } else{
        this.copter_status = 1;
        // console.log( this.copter_status );
      }
    } else if( this.copter_status == 1 ){ // fly forward to the log
      this.dist = Math.sqrt( Math.pow( this.logs[this.targetID].position.z - this.plane1.position.z, 2 ) + Math.pow( this.logs[this.targetID].position.x - this.plane1.position.x, 2 ) );
      if( Math.abs( this.dist ) >= 0.2 ){
        // console.log( this.dist );
        this.plane1.translateX( Math.abs( Kp * this.dist ) > speed_max ? Math.sign( this.dist ) * speed_max : Kp * this.dist );
      } else{
        this.copter_status = 2;
      }
    } else if( this.copter_status == 2 ){ // align angle to the log
      this.angle_err = - ( this.logs[this.targetID].rotation.y - this.plane1.rotation.y );
      if( Math.abs( this.angle_err ) >= 0.001 ){
        this.plane1.rotation.y -= Math.abs( Kp * this.angle_err ) > rot_max ? Math.sign( this.angle_err ) * rot_max : Kp * this.angle_err;
      } else{
        this.copter_status = 3;
        // console.log( this.copter_status );
      }
    } else if( this.copter_status == 3 ){ // descend to the catch log
      this.plane1.position.y -= speed_max;
      if( this.plane1.position.y <= this.logs[this.targetID].position.y + this.attch_dist ){
        this.copter_status = 4;
        this.log_status[this.targetID] = 1;
        // console.log( this.copter_status );
      }
    } else if( this.copter_status == 4 ){ // ascend to the flying height
      this.plane1.position.y += speed_max;
      if( this.plane1.position.y >= this.fly_height ){
        this.copter_status = 5;
        this.log_status[this.targetID] = 1;
        // console.log( this.copter_status );
      }
    } else if( this.copter_status == 5 ){ // align the flying angle
      this.angle_err = Math.atan2( this.orgnl_z - this.plane1.position.z, this.orgnl_x - this.plane1.position.x );
      this.angle_err -= ( - this.plane1.rotation.y );
      if( Math.abs( this.angle_err ) >= 0.001 ){
        this.plane1.rotation.y -= Math.abs( Kp * this.angle_err ) > rot_max ? Math.sign( this.angle_err ) * rot_max : Kp * this.angle_err;
      } else{
        this.copter_status = 6;
        // console.log( this.copter_status );
      }
    } else if( this.copter_status == 6 ){ // fly back
      this.dist = Math.sqrt( Math.pow( this.orgnl_z - this.plane1.position.z, 2 ) + Math.pow( this.orgnl_x - this.plane1.position.x, 2 ) );
      if( Math.abs( this.dist ) >= 0.2 ){
        // console.log( this.dist );
        this.plane1.translateX( Math.abs( Kp * this.dist ) > speed_max ? Math.sign( this.dist ) * speed_max : Kp * this.dist );
      } else{
        this.copter_status = 7;
      }
    } else if( this.copter_status == 7 ){
      this.angle_err = - ( 0 - this.plane1.rotation.y );
      if( Math.abs( this.angle_err ) >= 0.001 ){
        this.plane1.rotation.y -= Math.abs( Kp * this.angle_err ) > rot_max ? Math.sign( this.angle_err ) * rot_max : Kp * this.angle_err;
      } else{
        this.copter_status = 8;
        // console.log( this.copter_status );
      }
    } else if( this.copter_status == 8 ){
      this.plane1.position.y -= speed_max;
      if( this.plane1.position.y <= this.attch_dist ){
        this.copter_status = 9;
        this.log_status[this.targetID] = 2;
        // console.log( this.copter_status );
      }
    } else if( this.copter_status == 9 ){
      this.plane1.position.y += speed_max;
      if( this.plane1.position.y >= this.fly_height ){
        this.copter_status = 0;
        this.targetID += 1;
        if( this.targetID == this.logs.length ){
          this.resetLogs();
          this.targetID = 0;
        }
        // console.log( this.copter_status );
      }
    } else{
      this.resetLogs();
      this.targetID = 0;
    }
    
    if( this.log_status[this.targetID] == 1 ){
      this.logs[this.targetID].position.x = this.plane1.position.x;
      this.logs[this.targetID].rotation.y = this.plane1.rotation.y;
      this.logs[this.targetID].position.z = this.plane1.position.z;
      this.logs[this.targetID].position.y = this.plane1.position.y - this.attch_dist;
    }
    // this.platform.rotateY(0.003 * delta );
    this.plane1Propeller.rotateY( delta * 0.01 );
    this.plane1BackPropeller.rotateY( delta * 0.01 );
  }
}