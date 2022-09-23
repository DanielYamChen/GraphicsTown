/*jshint -W047,  esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
let woodPattern = new T.TextureLoader().load( "./images/wood.jfif" );
import { OBJLoader } from "../libs/CS559-Three/examples/jsm/loaders/OBJLoader.js";
let loader = new OBJLoader();
let Pole_num = 10;
let Horses = [];
for( let horse_idx = 0; horse_idx < Pole_num; horse_idx++ ){
  let horse = await loader.loadAsync( "./images/horse.obj" );
  horse.scale.set( 8e-4, 8e-4, 8e-4 );
  Horses.push( horse );
}

let simpleRoundaboutObCtr = 0;
// A simple merry-go-round.
/**
 * @typedef SimpleRoundaboutProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrSimpleRoundabout extends GrObject {
  /**
   * @param {SimpleRoundaboutProperties} params
   */
  constructor(params = {}) {
    let simpleRoundabout = new T.Group();

    let base_geom = new T.CylinderGeometry(0.5, 1, 0.5, 16);
    let base_mat = new T.MeshStandardMaterial({
      color: "#888888",
      metalness: 0.5,
      roughness: 0.8
    });
    let base = new T.Mesh(base_geom, base_mat);
    base.translateY(0.25);
    simpleRoundabout.add(base);

    let platform_geom = new T.CylinderGeometry(2, 1.8, 0.3, 8, 4);
    let platform_mat = new T.MeshStandardMaterial({
      color: "blue",
      metalness: 0.3,
      roughness: 0.6
    });

    let platform_group = new T.Group();
    base.add(platform_group);
    platform_group.translateY(0.25);
    let platform = new T.Mesh(platform_geom, platform_mat);
    platform_group.add(platform);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`SimpleRoundabout-${simpleRoundaboutObCtr++}`, simpleRoundabout);
    this.whole_ob = simpleRoundabout;
    this.platform = platform_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    simpleRoundabout.scale.set(scale, scale, scale);
  }
  /**
   * StepWorld method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld(delta, timeOfDay) {
    this.platform.rotateY(0.005 * delta);
  }

}

let roundaboutObCtr = 0;
// A colorful merry-go-round, with handles and differently-colored sections.
/**
 * @typedef ColoredRoundaboutProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrColoredRoundabout extends GrObject {
  /**
   * @param {ColoredRoundaboutProperties} params
   */
  constructor(params = {}) {
    let roundabout = new T.Group();

    let base_geom = new T.CylinderGeometry(0.5, 1, 0.5, 16);
    let base_mat = new T.MeshStandardMaterial({
      color: "#888888",
      metalness: 0.5,
      roughness: 0.8
    });
    let base = new T.Mesh(base_geom, base_mat);
    base.translateY(0.25);
    roundabout.add(base);

    let platform_group = new T.Group();
    base.add(platform_group);
    platform_group.translateY(0.25);

    let section_geom = new T.CylinderGeometry(
      2,
      1.8,
      0.3,
      8,
      4,
      false,
      0,
      Math.PI / 2
    );
    let section_mat;
    let section;

    let handle_geom = buildHandle();
    let handle_mat = new T.MeshStandardMaterial({
      color: "#999999",
      metalness: 0.8,
      roughness: 0.2
    });
    let handle;

    // in the loop below, we add four differently-colored sections, with handles,
    // all as part of the platform group.
    let section_colors = ["red", "blue", "yellow", "green"];
    for (let i = 0; i < section_colors.length; i++) {
      section_mat = new T.MeshStandardMaterial({
        color: section_colors[i],
        metalness: 0.3,
        roughness: 0.6
      });
      section = new T.Mesh(section_geom, section_mat);
      handle = new T.Mesh(handle_geom, handle_mat);
      section.add(handle);
      handle.rotation.set(0, Math.PI / 4, 0);
      handle.translateZ(1.5);
      platform_group.add(section);
      section.rotateY((i * Math.PI) / 2);
    }

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`Roundabout-${roundaboutObCtr++}`, roundabout);
    this.id = roundaboutObCtr - 1;
    this.whole_ob = roundabout;
    this.platform = platform_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    this.whole_ob.rotation.y = this.id * Math.PI / 6;
    let scale = params.size ? Number(params.size) : 1;
    roundabout.scale.set(scale, scale, scale);

    // This helper function defines a curve for the merry-go-round's handles,
    // then extrudes a tube along the curve to make the actual handle geometry.
    function buildHandle() {
      /**@type THREE.CurvePath */
      let handle_curve = new T.CurvePath();
      handle_curve.add(
        new T.LineCurve3(new T.Vector3(-0.5, 0, 0), new T.Vector3(-0.5, 0.8, 0))
      );
      handle_curve.add(
        new T.CubicBezierCurve3(
          new T.Vector3(-0.5, 0.8, 0),
          new T.Vector3(-0.5, 1, 0),
          new T.Vector3(0.5, 1, 0),
          new T.Vector3(0.5, 0.8, 0)
        )
      );
      handle_curve.add(
        new T.LineCurve3(new T.Vector3(0.5, 0.8, 0), new T.Vector3(0.5, 0, 0))
      );
      return new T.TubeGeometry(handle_curve, 64, 0.1, 8);
    }
  }
  /**
   * StepWorld Method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld(delta, timeOfDay) {
    this.platform.rotateY(0.003 * delta );
  }


}

let simpleSwingObCtr = 0;
// A basic, one-seat swingset.
/**
 * @typedef SimpleSwingProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrSimpleSwing extends GrObject {
  /**
   * @param {SimpleSwingProperties} params
   */
  constructor(params = {}) {
    let simpleSwing = new T.Group();
    addPosts(simpleSwing);

    // Here, we create a "hanger" group, which the swing chains will hang from.
    // The "chains" for the simple swing are just a couple thin cylinders.
    let hanger = new T.Group();
    simpleSwing.add(hanger);
    hanger.translateY(1.8);
    let chain_geom = new T.CylinderGeometry(0.05, 0.05, 1.4);
    let chain_mat = new T.MeshStandardMaterial({
      color: "#777777",
      metalness: 0.8,
      roughness: 0.2
    });
    let l_chain = new T.Mesh(chain_geom, chain_mat);
    let r_chain = new T.Mesh(chain_geom, chain_mat);
    hanger.add(l_chain);
    hanger.add(r_chain);
    l_chain.translateY(-0.75);
    l_chain.translateZ(0.4);
    r_chain.translateY(-0.75);
    r_chain.translateZ(-0.4);

    let seat_group = new T.Group();
    let seat_geom = new T.BoxGeometry(0.4, 0.1, 1);
    let seat_mat = new T.MeshStandardMaterial({
      color: "#554433",
      metalness: 0.1,
      roughness: 0.6
    });
    let seat = new T.Mesh(seat_geom, seat_mat);
    seat_group.add(seat);
    seat_group.position.set(0, -1.45, 0);
    hanger.add(seat_group);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`SimpleSwing-${simpleSwingObCtr++}`, simpleSwing);
    this.whole_ob = simpleSwing;
    this.hanger = hanger;
    this.seat = seat_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    simpleSwing.scale.set(scale, scale, scale);

    this.swing_max_rotation = Math.PI / 4;
    this.swing_direction = 1;

    // This helper function creates the 5 posts for a swingset frame,
    // and positions them appropriately.
    function addPosts(group) {
      let post_material = new T.MeshStandardMaterial({
        color: "red",
        metalness: 0.6,
        roughness: 0.5
      });
      let post_geom = new T.CylinderGeometry(0.1, 0.1, 2, 16);
      let flPost = new T.Mesh(post_geom, post_material);
      group.add(flPost);
      flPost.position.set(0.4, 0.9, 0.9);
      flPost.rotateZ(Math.PI / 8);
      let blPost = new T.Mesh(post_geom, post_material);
      group.add(blPost);
      blPost.position.set(-0.4, 0.9, 0.9);
      blPost.rotateZ(-Math.PI / 8);
      let frPost = new T.Mesh(post_geom, post_material);
      group.add(frPost);
      frPost.position.set(0.4, 0.9, -0.9);
      frPost.rotateZ(Math.PI / 8);
      let brPost = new T.Mesh(post_geom, post_material);
      group.add(brPost);
      brPost.position.set(-0.4, 0.9, -0.9);
      brPost.rotateZ(-Math.PI / 8);
      let topPost = new T.Mesh(post_geom, post_material);
      group.add(topPost);
      topPost.position.set(0, 1.8, 0);
      topPost.rotateX(-Math.PI / 2);
    }
  }
  /* stepWorld method - make the swing swing! */
    stepWorld(delta, timeOfDay) {
        // if we swing too far forward or too far backward, switch directions.
        if (this.hanger.rotation.z >= this.swing_max_rotation)
            this.swing_direction = -1;
        else if (this.hanger.rotation.z <= -this.swing_max_rotation)
            this.swing_direction = 1;
        this.hanger.rotation.z += this.swing_direction * 0.003 * delta;
    }

}


let swingObCtr = 0;
// A more complicated, one-seat swingset.
// This one has actual chain links for its chains,
// and uses a nicer animation to give a more physically-plausible motion.
/**
 * @typedef AdvancedSwingProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrAdvancedSwing extends GrObject {
  /**
   * @param {AdvancedSwingProperties} params
   */
  constructor(params = {}) {
    let swing = new T.Group();
    addPosts(swing);

    let hanger = new T.Group();
    swing.add(hanger);
    hanger.translateY(1.8);
    let l_chain = new T.Group();
    let r_chain = new T.Group();
    hanger.add(l_chain);
    hanger.add(r_chain);
    // after creating chain groups, call the function to add chain links.
    growChain(l_chain, 20);
    growChain(r_chain, 20);
    l_chain.translateZ(0.4);
    r_chain.translateZ(-0.4);

    let seat_group = new T.Group();
    let seat_geom = new T.BoxGeometry(0.4, 0.1, 1);
    let seat_mat = new T.MeshStandardMaterial({
      color: "#554433",
      metalness: 0.1,
      roughness: 0.6
    });
    let seat = new T.Mesh(seat_geom, seat_mat);
    seat_group.add(seat);
    seat_group.position.set(0, -1.45, 0);
    hanger.add(seat_group);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`Swing-${swingObCtr++}`, swing);
    this.id = swingObCtr - 1;
    this.whole_ob = swing;
    this.hanger = hanger;
    this.seat = seat_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    swing.scale.set(scale, scale, scale);

    this.swing_angle = 0;

    // This helper function creates the 5 posts for a swingset frame,
    // and positions them appropriately.
    function addPosts(group) {
      let post_material = new T.MeshStandardMaterial({
        color: "red",
        metalness: 0.6,
        roughness: 0.5
      });
      let post_geom = new T.CylinderGeometry(0.1, 0.1, 2, 16);
      let flPost = new T.Mesh(post_geom, post_material);
      group.add(flPost);
      flPost.position.set(0.4, 0.9, 0.9);
      flPost.rotateZ(Math.PI / 8);
      let blPost = new T.Mesh(post_geom, post_material);
      group.add(blPost);
      blPost.position.set(-0.4, 0.9, 0.9);
      blPost.rotateZ(-Math.PI / 8);
      let frPost = new T.Mesh(post_geom, post_material);
      group.add(frPost);
      frPost.position.set(0.4, 0.9, -0.9);
      frPost.rotateZ(Math.PI / 8);
      let brPost = new T.Mesh(post_geom, post_material);
      group.add(brPost);
      brPost.position.set(-0.4, 0.9, -0.9);
      brPost.rotateZ(-Math.PI / 8);
      let topPost = new T.Mesh(post_geom, post_material);
      group.add(topPost);
      topPost.position.set(0, 1.8, 0);
      topPost.rotateX(-Math.PI / 2);
    }

    // Helper function to add "length" number of links to a chain.
    function growChain(group, length) {
      let chain_geom = new T.TorusGeometry(0.05, 0.015);
      let chain_mat = new T.MeshStandardMaterial({
        color: "#777777",
        metalness: 0.8,
        roughness: 0.2
      });
      let link = new T.Mesh(chain_geom, chain_mat);
      group.add(link);
      for (let i = 0; i < length; i++) {
        let l_next = new T.Mesh(chain_geom, chain_mat);
        l_next.translateY(-0.07);
        link.add(l_next);
        l_next.rotation.set(0, Math.PI / 3, 0);
        link = l_next;
      }
    }
  }
  /**
   * StepWorld method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld(delta, timeOfDay) {
    // in this animation, use the sine of the accumulated angle to set current rotation.
    // This means the swing moves faster as it reaches the bottom of a swing,
    // and faster at either end of the swing, like a pendulum should.
    this.swing_angle += 0.005 * delta;
    this.hanger.rotation.z = (Math.sin( this.swing_angle + this.id * Math.PI / 6 ) * Math.PI) / 4;
    this.seat.rotation.z = (Math.sin( this.swing_angle + this.id * Math.PI / 6 ) * Math.PI) / 16;
  }

}


let carouselObCtr = 0;
// A Carousel.
/**
 * @typedef CarouselProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrCarousel extends GrObject {
  /**
   * @param {CarouselProperties} params
   */
  constructor(params = {}) {
    let width = 3;
    let carousel = new T.Group();

    let base_geom = new T.CylinderGeometry(width, width, 1, 32);
    let base_mat = new T.MeshStandardMaterial({
      color: "lightblue",
      metalness: 0.3,
      roughness: 0.8
    });
    let base = new T.Mesh(base_geom, base_mat);
    base.translateY(0.5);
    carousel.add(base);

    let platform_group = new T.Group();
    base.add(platform_group);
    platform_group.translateY(0.5);

    let platform_geom = new T.CylinderGeometry(
      0.95 * width,
      0.95 * width,
      0.2,
      32
    );
    let platform_mat = new T.MeshStandardMaterial({
      color: "gold",
      metalness: 0.3,
      roughness: 0.8
    });
    let platform = new T.Mesh(platform_geom, platform_mat);
    platform_group.add(platform);

    let cpole_geom = new T.CylinderGeometry(0.3 * width, 0.3 * width, 3, 16);
    let cpole_mat = new T.MeshStandardMaterial({
      color: "gold",
      metalness: 0.8,
      roughness: 0.5
    });
    let cpole = new T.Mesh(cpole_geom, cpole_mat);
    platform_group.add(cpole);
    cpole.translateY(1.5);

    let top_trim = new T.Mesh(platform_geom, platform_mat);
    platform_group.add(top_trim);
    top_trim.translateY(3);

    let opole_geom = new T.CylinderGeometry(0.03 * width, 0.03 * width, 3, 16);
    let opole_mat = new T.MeshStandardMaterial({
      color: "#aaaaaa",
      metalness: 0.8,
      roughness: 0.5
    });
    let opole;
    let num_poles = Pole_num;
    let poles = [];
    for (let i = 0; i < num_poles; i++) {
      opole = new T.Mesh(opole_geom, opole_mat);
      platform_group.add(opole);
      opole.translateY(1.5);
      opole.rotateY((2 * i * Math.PI) / num_poles);
      opole.translateX(0.8 * width);
      poles.push(opole);
    }

    // add the horses for each pole
    // let horseShape = new T.BoxGeometry(0.1 * width, 0.2 * width, 0.3 * width );
    // let horseMaterial = new T.MeshStandardMaterial({ color: "goldenrod", metalness: 0.0,roughness: 1.0 });
    for (let i = 0; i < num_poles; i++) {
      // let horse = new T.Mesh( horseShape, horseMaterial );
      // Horses[i].scale.set( 0.9, 0.9, 0.9 );
      Horses[i].rotation.x = Math.PI / 2;
      Horses[i].rotation.y = Math.PI;
      poles[i].add(Horses[i]);
    }
    

    let roof_geom = new T.ConeGeometry(width, 0.5 * width, 32, 4);
    let roof = new T.Mesh(roof_geom, base_mat);
    carousel.add(roof);
    roof.translateY(4.8);

    
    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`Carousel-${carouselObCtr++}`, carousel);
    this.whole_ob = carousel;
    this.platform = platform_group;
    this.poles = poles;
    this.horses = Horses;
    this.width = width;
    this.timestamp = 0;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    carousel.scale.set(scale, scale, scale);
  }

  stepWorld( delta, timeOfDay ) {
    this.timestamp += delta;
    this.timestamp = ( this.timestamp > 2 * Math.PI ) ? ( this.timestamp - 2 * Math.PI ) : ( this.timestamp );
    this.platform.rotateY( 0.001 * delta );
    for (let i = 0; i < this.horses.length; i++) {
      if( i % 2 == 0 ){
        this.horses[i].position.y = 0.2 * this.width * Math.sin( 0.004 * this.timestamp ) - 0.6;
      } else{
        this.horses[i].position.y = 0.2 * this.width * Math.cos( 0.004 * this.timestamp ) - 0.6;
      }
    }
  }
}


let seesawObCtr = 0;
// A basic, two paired-seated seesaw.
/**
 * @typedef SeesawProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [rot_y=0]
 * @property {number} [size=1]
 */
export class GrSeesaw extends GrObject {
  /**
   * @param {SeesawProperties} params
   */
  constructor(params = {}) {
    let seesaw = new T.Group();

    let baseGeom = new T.CylinderGeometry(0.5,0.5,1.4,64);
    let baseMat = new T.MeshStandardMaterial({color: "grey",metalness: 0.8, roughness: 0.2 });
    let base = new T.Mesh(baseGeom, baseMat);
    base.rotation.x = Math.PI / 2;
    base.position.y = baseGeom.parameters.radiusBottom;
    seesaw.add(base);

    let logGeom = new T.CylinderGeometry(0.3,0.3,8,64);
    let logMat = new T.MeshStandardMaterial({color: "saddlebrown",metalness: 0.0, roughness: 0.8 });
    let log = new T.Mesh(logGeom, logMat);
    log.rotation.z = Math.PI / 2;
    log.position.y = base.position.y + baseGeom.parameters.radiusBottom + logGeom.parameters.radiusBottom;
    seesaw.add(log);

    let seatGeom = new T.BoxGeometry(0.3,1,1);
    let seat1 = new T.Mesh(seatGeom, logMat);
    seat1.position.y = logGeom.parameters.height / 2 * 0.95;
    seat1.position.x = logGeom.parameters.radiusBottom;
    let seat2 = new T.Mesh(seatGeom, logMat);
    seat2.position.y = - logGeom.parameters.height / 2 * 0.95;
    seat2.position.x = logGeom.parameters.radiusBottom;
    
    log.add(seat1);
    log.add(seat2);

    super(`Seesaw-${seesawObCtr++}`, seesaw );
    this.id = seesawObCtr - 1;
    this.whole_ob = seesaw;
    this.log = log;
    this.timestamp = 0.0;

    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    this.whole_ob.rotation.y = params.rot_y ? Number(params.rot_y) : 0;
    let scale = params.size ? Number(params.size) : 1;
    seesaw.scale.set(scale, scale, scale);
  }

    stepWorld(delta, timeOfDay) {
      this.timestamp += delta;
      this.timestamp = ( this.timestamp > 2 * Math.PI ) ? ( this.timestamp - 2 * Math.PI ) : ( this.timestamp );
      this.log.rotation.z = 0.3 * Math.sin( 0.005 * this.timestamp + this.id * Math.PI / 6 ) + Math.PI / 2;
    }

}


let ferrisWheelObCtr = 0;
// A ferris wheel.
/**
 * @typedef FerrisWheelProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrFerrisWheel extends GrObject {
  constructor(params = {}) {
    let ferrisWheel = new T.Group();
    let ferrisWheelBase = new T.Group();
    let car_num = 8;

    let poleGeom = new T.BoxGeometry( 8, 0.6, 0.3 );
    // let poleMat = new T.MeshStandardMaterial({ color: "saddlebrown",metalness: 0.0, roughness: 0.2 });
    let poleMat = new T.MeshStandardMaterial({ map: woodPattern });
    let poleBase_set = [];
    for( let i = 0; i < car_num; i++ ){
      poleBase_set.push( new T.Group() );
      let pole = new T.Mesh( poleGeom, poleMat );
      pole.position.x = poleGeom.parameters.width / 2.0;
      poleBase_set[i].add( pole );
      poleBase_set[i].rotation.z = 2 * Math.PI / car_num * i;
      ferrisWheelBase.add( poleBase_set[i] );
    }
    
    let carGeom = new T.BoxGeometry( 2.5, 2, 2 );
    let carMat = new T.MeshStandardMaterial({ color: "aqua", metalness: 0.0, roughness: 0.2 });
    let carBaseGeom = new T.BoxGeometry( 2.5, 2/3, 2 );
    let carBaseMat = new T.MeshStandardMaterial({ color: "forestgreen",metalness: 0.0, roughness: 1.0 });
    let carBase_set = [];
    for( let i = 0; i < car_num; i++ ){
      let car = new T.Mesh( carGeom, carMat );
      let carBase = new T.Mesh( carBaseGeom, carBaseMat );
      car.position.y = - carGeom.parameters.height / 2 + poleGeom.parameters.height / 2;
      car.position.z = ( carGeom.parameters.depth + poleGeom.parameters.depth ) / 2;
      carBase.position.y = - carGeom.parameters.height + poleGeom.parameters.height / 2 - carBaseGeom.parameters.height / 2;
      carBase.position.z = ( carGeom.parameters.depth + poleGeom.parameters.depth ) / 2;
      carBase_set.push( new T.Group() );
      carBase_set[i].add( car ); 
      carBase_set[i].add( carBase );
      ferrisWheel.add( carBase_set[i] );
    }

    ferrisWheelBase.position.y = poleGeom.parameters.width + carGeom.parameters.height + carBaseGeom.parameters.height;
    ferrisWheelBase.position.z = poleGeom.parameters.depth / 2;
    ferrisWheel.add( ferrisWheelBase );

    let supportGeom = new T.BoxGeometry( 4.0, ferrisWheelBase.position.y * 1.1, 1.0 );
    let supportMat = new T.MeshStandardMaterial({ color: "gray",metalness: 0.0, roughness: 1.0 });
    let support = new T.Mesh( supportGeom, supportMat );
    support.position.y = supportGeom.parameters.height / 2;
    support.position.z = - supportGeom.parameters.depth / 2;
    ferrisWheel.add( support );

    super(`FerrisWheel-${ferrisWheelObCtr++}`, ferrisWheel );
    this.wholeOb = ferrisWheel;
    this.ferrisWheelBase = ferrisWheelBase;
    this.carBase_set = carBase_set;
    this.radius = poleGeom.parameters.width;
    this.car_num = car_num;

    this.wholeOb.position.x = params.x ? Number(params.x) : 0;
    this.wholeOb.position.y = params.y ? Number(params.y) : 0;
    this.wholeOb.position.z = params.z ? Number(params.z) : 0;
    let s = params.size ? Number(params.size) : 1;
    ferrisWheel.scale.set( s, s, s );
  }

  stepWorld( delta, timeOfDay ) {
    // this.timestamp += delta;
    this.ferrisWheelBase.rotation.z += 3e-4 * delta;
    this.ferrisWheelBase.rotation.z = this.ferrisWheelBase.rotation.z > Math.PI * 2 ? ( this.ferrisWheelBase.rotation.z - Math.PI * 2 ) : this.ferrisWheelBase.rotation.z;
    // console.log(this.wholeOb.position.y);
    for( let i = 0; i < this.car_num; i++ ){
      let angle = this.ferrisWheelBase.rotation.z + Math.PI * 2 / this.car_num * i;
      this.carBase_set[i].position.x = this.ferrisWheelBase.position.x + this.radius * Math.cos( angle );
      this.carBase_set[i].position.y = this.ferrisWheelBase.position.y + this.radius * Math.sin( angle );
    }
  }
}


let railObCtr = 0;
// A rail system comprises a steel rail, wood ties, and some cars.
/**
 * @typedef RailProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrRail extends GrObject {
  
  constructor( thePoints, tension, params={} ) {
    let prvs_idx = 0, nxt_idx = 0, tangent_s = [ 0., 0., 0. ], tangent_e = [ 0., 0., 0. ];
    let i_nxt = 0;

    // let curvePoints = [];
    let rails = new T.Group();
    for( let i = 0; i < thePoints.length; i++ ){
      i_nxt = ( i + 1 ) % thePoints.length;
      if( i == 0 ){
        prvs_idx = ( i - 1 >= 0 ) ? ( i - 1 ) : ( i - 1 + thePoints.length );
        nxt_idx = ( i + 1 ) % thePoints.length;
        tangent_s[0] = ( thePoints[nxt_idx][0] - thePoints[prvs_idx][0] ) * ( 1 - tension ) / 2;
        tangent_s[1] = ( thePoints[nxt_idx][1] - thePoints[prvs_idx][1] ) * ( 1 - tension ) / 2;
        tangent_s[2] = ( thePoints[nxt_idx][2] - thePoints[prvs_idx][2] ) * ( 1 - tension ) / 2;
      }
      prvs_idx = i;
      nxt_idx = ( i + 2 ) % thePoints.length;
      tangent_e[0] = ( thePoints[nxt_idx][0] - thePoints[prvs_idx][0] ) * ( 1 - tension ) / 2;
      tangent_e[1] = ( thePoints[nxt_idx][1] - thePoints[prvs_idx][1] ) * ( 1 - tension ) / 2;
      tangent_e[2] = ( thePoints[nxt_idx][2] - thePoints[prvs_idx][2] ) * ( 1 - tension ) / 2;

      // Reference the code example on
      // https://threejs.org/docs/#api/en/extras/curves/CubicBezierCurve3
      let curve = new T.CubicBezierCurve3(
        new T.Vector3( thePoints[i][0], thePoints[i][1], thePoints[i][2] ),
        new T.Vector3( thePoints[i][0] + tangent_s[0]/3, thePoints[i][1] + tangent_s[1]/3, thePoints[i][2] + tangent_s[2]/3 ),
        new T.Vector3( thePoints[i_nxt][0] - tangent_e[0]/3, thePoints[i_nxt][1] - tangent_e[1]/3, thePoints[i_nxt][2] - tangent_e[2]/3 ),
        new T.Vector3( thePoints[i_nxt][0], thePoints[i_nxt][1], thePoints[i_nxt][2] )
      );

      let curveGeom = new T.TubeGeometry( curve, 64, 0.1, 64, false );
      let curveMat = new T.MeshStandardMaterial( { color: 0x000000 } );
      // let curveGeom = new T.BufferGeometry().setFromPoints( curve.getPoints( 100 ) );
      // const curveMat = new T.LineBasicMaterial( { color : 0x000000, linewidth: 0.8 } );
      // Create the final rail object
      let rail = new T.Line( curveGeom, curveMat );
      rails.add( rail );
      tangent_s[0] = tangent_e[0];
      tangent_s[1] = tangent_e[1];
      tangent_s[2] = tangent_e[2];
      
      // let seg_points = curve.getPoints( 100 );
      // for( let j = 0; j < seg_points.length; j++ ){
      //   curvePoints.push( seg_points[j] );
      // }
    }
    
    let car_num = 4;
    let cars = [];
    let train_l = 1.5;
    let carGeom = new T.BoxGeometry( train_l, train_l * 2/3, train_l * 2/3 );
    let carMat = new T.MeshStandardMaterial({ color: "gray", roughness: 1.0, metalness: 0.0 });
    for( let car_idx = 0;  car_idx < car_num; car_idx++ ){
      let car = new T.Mesh( carGeom, carMat );
      car.position.y = carGeom.parameters.height / 2;
      cars.push( car );
      rails.add( cars[car_idx] );
    }
    super(`Rail-${railObCtr++}`, rails );
    this.rideable = cars[0];

    this.wholeOb = rails;
    this.cars = cars;
    this.thePoints = thePoints;
    this.tension = tension;
    this.t_s_table = undefined;
    this.arc_length = -1.0;
    [ this.t_s_table, this.arc_length ] = this.buildArcTable( thePoints );
    this.ties = this.getRailTies();
    for( let tie_idx = 0;  tie_idx < this.ties.length; tie_idx++ ){
      rails.add( this.ties[tie_idx] );
    }
    this.timestamp = 0.;
    this.train_l = train_l;
    this.anime = false;
    this.car_num = car_num;

    this.wholeOb.position.x = params.x ? Number(params.x) : 0;
    this.wholeOb.position.y = params.y ? Number(params.y) : 0;
    this.wholeOb.position.z = params.z ? Number(params.z) : 0;
    let s = params.size ? Number(params.size) : 1;
    rails.scale.set( s, s, s );
  }

  // return the x, z, and theta of the head har
  calcTrainHeadPos( t_tot ){
    if( t_tot >= this.thePoints.length ){
      t_tot = 0;
    }
    let seg_idx = Math.floor(t_tot);
    let u = t_tot - seg_idx;
    let pt_s = this.thePoints[ seg_idx ];
    let pt_e = this.thePoints[ ( seg_idx + 1 ) % this.thePoints.length ];
    
    // base functions for the cubic cardinal spline
    let base_func = [ 1 - 3 * Math.pow(u,2) + 2 * Math.pow(u,3),
                      u - 2 * Math.pow(u,2) + Math.pow(u,3),
                      3 * Math.pow(u,2) - 2 * Math.pow(u,3),
                      - Math.pow(u,2) + Math.pow(u,3) ];
    
    // 1st-order derivatives of the base functions
    let bas_prime = [ - 6 * u + 6 * Math.pow(u,2),
                      1 - 4 * u + 3 * Math.pow(u,2),
                      6 * u - 6 * Math.pow(u,2),
                      - 2 * u + 3 * Math.pow(u,2) ];
  
    let prvs_idx = ( seg_idx - 1 >= 0 ) ? ( seg_idx - 1 ) : ( seg_idx - 1 + this.thePoints.length );
    let pt_s_prime = [ ( pt_e[0] - this.thePoints[prvs_idx][0] )  * ( 1 - this.tension ) / 2,
                       ( pt_e[2] - this.thePoints[prvs_idx][2] )  * ( 1 - this.tension ) / 2 ];
    let nxt_idx = ( seg_idx + 2 ) % this.thePoints.length;
    let pt_e_prime = [ ( this.thePoints[nxt_idx][0] - pt_s[0] )  * ( 1 - this.tension ) / 2,
                       ( this.thePoints[nxt_idx][2] - pt_s[2] )  * ( 1 - this.tension ) / 2 ];
    
    return [ base_func[0]*pt_s[0] + base_func[1]*pt_s_prime[0] + base_func[2]*pt_e[0] + base_func[3]*pt_e_prime[0],
             base_func[0]*pt_s[2] + base_func[1]*pt_s_prime[1] + base_func[2]*pt_e[2] + base_func[3]*pt_e_prime[1],
             Math.atan2( bas_prime[0]*pt_s[2] + bas_prime[1]*pt_s_prime[1] + bas_prime[2]*pt_e[2] + bas_prime[3]*pt_e_prime[1],
                         bas_prime[0]*pt_s[0] + bas_prime[1]*pt_s_prime[0] + bas_prime[2]*pt_e[0] + bas_prime[3]*pt_e_prime[0] ) ];
  }

  buildArcTable( thePoints ){
    let i_nxt = 0;
    let seg_num = 0;
    let t_s_table = [];
    let small_s = [ 0., 0., 0. ], small_e = [ 0., 0., 0. ];
    let small_arc = 0.;
    let arc_length = 0.;
  
    t_s_table.push([ 0., 0. ]);
    for( let i = 0; i < thePoints.length; i++ ){
      i_nxt = ( i + 1 ) % thePoints.length;
      seg_num = Math.sqrt( Math.pow( thePoints[i_nxt][0] - thePoints[i][0], 2 ) + Math.pow( thePoints[i_nxt][2] - thePoints[i][2], 2 ) );
      seg_num = Math.round( ( seg_num / 0.1 ) );
      for( let j = 1 / seg_num; j <= 1 + 1e-6; j = j + 1 / seg_num ){
        small_s = this.calcTrainHeadPos( Math.max( i + j - 1 / seg_num, 0 ) );
        small_e = this.calcTrainHeadPos( Math.min( i + j, i + 1 ) );
        small_arc = Math.sqrt( Math.pow( small_s[0] - small_e[0], 2 ) + Math.pow( small_s[1] - small_e[1], 2 ) );
        arc_length = arc_length + small_arc;
        t_s_table.push([ Math.min( i + j, i + 1 ), arc_length ]);
      }
    }
    t_s_table.forEach( function(pair){
      pair[1] = pair[1] / arc_length * thePoints.length;
    });
    
    // this.t_s_table =  t_s_table;
    // this.arc_length = arc_length;
    return [ t_s_table, arc_length ];
  }

  t_of_s( s ){
    let i_idx = 0, f_idx = this.t_s_table.length - 1 ;
    // console.log(this.t_s_table.length);
    let t_idx = Math.round( ( i_idx + f_idx ) / 2 );
    while( ( s - this.t_s_table[t_idx][1] ) * ( s - this.t_s_table[t_idx+1][1] ) > 0 ){
      if( s - this.t_s_table[t_idx][1] > 0 ){
        t_idx = t_idx + 1;
      } else {
        t_idx = t_idx - 1;
      }
      if( i_idx > t_idx || t_idx > f_idx || this.t_s_table[t_idx] == undefined || this.t_s_table[t_idx+1] == undefined ){
        break;
      }
      // console.log(t_idx+1);
    }
    
    return this.t_s_table[t_idx][0];
  }

  s_of_t( t ){
    let i_idx = 0, f_idx = this.t_s_table.length - 1 ;
    let s_idx = Math.round( i_idx + f_idx / 2 );
  
    while( ( t - this.t_s_table[s_idx][0] ) * ( t - this.t_s_table[s_idx+1][0] ) > 0){
      if( t - this.t_s_table[s_idx][0] > 0 ){
        s_idx = s_idx + 1;
      } else {
        s_idx = s_idx - 1;
      }
    }
    
    return this.t_s_table[s_idx][1];
  }
  
  getRailTies(){
    const tie_seg = 0.01 * this.thePoints.length;
    let t = 0.;
    let tie_x = 0., tie_y = 0., tie_theta = 0.;
    let tieGeom = new T.BoxGeometry( 1.0, 0.1, 0.1 );
    let tieMat = new T.MeshStandardMaterial({ color: "saddlebrown", metalness: 0.0, roughness: 1.0 });
    let ties = [];
    for(let i = 0.; i < this.thePoints.length; i = i + tie_seg ){
      t = this.t_of_s( i );
      // console.log( t );
      [ tie_x, tie_y, tie_theta ] = this.calcTrainHeadPos( t );
      let tie = new T.Mesh( tieGeom, tieMat );
      // console.log( tie_x, tie_y, tie_theta );
      tie.position.x = tie_x;
      tie.position.z = tie_y;
      tie.rotation.y = - tie_theta + Math.PI / 2;
      ties.push( tie );
    }
    return ties;
  }

  stepWorld( delta, timeOfDay ) {
    this.timestamp += delta * 0.0003;
    this.timestamp = ( this.timestamp >= this.thePoints.length ) ? ( this.timestamp - this.thePoints.length ) : this.timestamp;
    if( this.timestamp > 1.5 ){
      this.anime = true;
    }
    if( this.anime ){
      let head_x = 0., head_y = 0., head_theta = 0.;
      let car_x = new Array(this.car_num);
      let car_y = new Array(this.car_num);
      let car_theta = new Array(this.car_num);
      let Car_dist = 2 * this.train_l * 0.6 / this.arc_length * this.thePoints.length;
      let s = this.timestamp;
      // console.log( s );
      let t = this.t_of_s( s );
      [ head_x, head_y, head_theta ] = this.calcTrainHeadPos( t );
      for( let i=0; i<car_x.length; i++ ){
        // get the arc-length param of train car by the arc-length param of train head
        s = this.timestamp - ( i + 1 ) * Car_dist;
        s = ( s >= 0 ) ? s : ( s + this.thePoints.length );
        // calculate the corresponding normal param from the arc-length param of the train car
        t = this.t_of_s( s );
        [ car_x[i], car_y[i], car_theta[i] ] = this.calcTrainHeadPos( t );
      }
      this.cars[0].position.x = head_x;
      this.cars[0].position.z = head_y;
      this.cars[0].rotation.y = - head_theta;
      for( let i=1; i<car_x.length; i++ ){
        this.cars[i].position.x = car_x[i-1];
        this.cars[i].position.z = car_y[i-1];
        this.cars[i].rotation.y = - car_theta[i-1];
      }
    }
  }
}


let coffeeCupObCtr = 0;
// A simple merry-go-round.
/**
 * @typedef CoffeeCupProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrCoffeeCup extends GrObject {
  /**
   * @param {CoffeeCupProperties} params
   */
  constructor(params = {}) {
    let coffeeCup = new T.Group();

    let base_geom = new T.CylinderGeometry(0.5, 1, 0.3, 64);
    let base_mat = new T.MeshStandardMaterial({
      color: "#888888",
      metalness: 0.5,
      roughness: 0.8
    });
    let base = new T.Mesh(base_geom, base_mat);
    base.position.y = base_geom.parameters.height / 2;
    coffeeCup.add( base );

    let platformGeom = new T.CylinderGeometry(4, 4, 0.3, 64, 8 );
    let platformMat = new T.MeshStandardMaterial({ color: "gray", metalness: 0.3, roughness: 0.6 });
    let platform = new T.Mesh(platformGeom, platformMat);
    
    base.add(platform);
    platform.position.y = ( platformGeom.parameters.height + base_geom.parameters.height ) / 2;

    let plateGeom = new T.CylinderGeometry(1.85, 1.85, 0.3, 64, 8 );
    let plateMat = new T.MeshStandardMaterial({ color: "saddlebrown", metalness: 0.3, roughness: 0.6 });
    let plate_num = 3;
    let plates = [];
    for( let plate_idx = 0; plate_idx < plate_num; plate_idx++ ){
      let plate = new T.Mesh( plateGeom, plateMat);
      plate.position.x = 2.14 * Math.cos( 2 * Math.PI / 3 * plate_idx );
      plate.position.z = 2.14 * Math.sin( 2 * Math.PI / 3 * plate_idx );
      plate.position.y = platformGeom.parameters.height / 2;
      plate.rotation.y = Math.PI / 4;
      plates.push( plate );
      platform.add( plate );
    }

    let cup1Geom = new T.CylinderGeometry(0.7, 0.4, 0.4, 64, 8 );
    let cup2Geom = new T.TorusGeometry( 0.13, 0.06, 64, 64 );
    let cupMat = new T.MeshStandardMaterial({ map: woodPattern });
    let cup_num = 3;
    let cups = [];
    for( let plate_idx = 0; plate_idx < plate_num; plate_idx++ ){
      for( let cup_idx = 0; cup_idx < cup_num; cup_idx++ ){
        let cup = new T.Group();
        let cup1 = new T.Mesh( cup1Geom, cupMat);
        let cup2 = new T.Mesh( cup2Geom, cupMat);
        cup.add( cup1 );
        cup.position.x = 1.1 * Math.cos( 2 * Math.PI / 3 * cup_idx );
        cup.position.z = 1.1 * Math.sin( 2 * Math.PI / 3 * cup_idx );
        cup.position.y = ( plateGeom.parameters.height + cup1Geom.parameters.height ) / 2;
        cup2.position.x = 0.67;
        cup2.position.y = cup1Geom.parameters.height / 2;
        cup.add( cup2 );
        cup.rotation.y = 2 * Math.PI / ( plate_num * cup_num ) * ( plate_idx * cup_num + cup_idx );
        cups.push( cup );
        plates[plate_idx].add( cup );
      }
    }

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`CoffeeCup-${coffeeCupObCtr++}`, coffeeCup );
    this.whole_ob = coffeeCup;
    this.platform = platform;
    this.plates = plates;
    this.cups = cups;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    coffeeCup.scale.set(scale, scale, scale);
  }
  /**
   * StepWorld method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld(delta, timeOfDay) {
    this.platform.rotateY(0.0005 * delta);
    this.plates.forEach( function( plate ){
      plate.rotateY( 0.0007 * delta );
    });
    for( let cup_idx = 0; cup_idx < this.cups.length; cup_idx++ ){
      this.cups[ cup_idx ].rotateY( Math.pow( -1, cup_idx ) * 0.001 * delta );
    }
  }
}


