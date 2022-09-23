/*jshint -W047, esversion: 6 */
// @ts-check

/**
 * Graphics Town Framework - "Main" File
 *
 * This is the main file - it creates the world, populates it with
 * objects and behaviors, and starts things running
 *
 * The initial distributed version has a pretty empty world.
 * There are a few simple objects thrown in as examples.
 *
 * It is the students job to extend this by defining new object types
 * (in other files), then loading those files as modules, and using this
 * file to instantiate those objects in the world.
 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { WorldUI } from "../libs/CS559-Framework/WorldUI.js";
import * as SimpleObjects from "../libs/CS559-Framework/SimpleObjects.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";

import { GrSimpleSwing, GrAdvancedSwing, GrCarousel, GrColoredRoundabout,
         GrSeesaw, GrFerrisWheel, GrRail, GrCoffeeCup } from "./12-parkobjects.js";
import { GrCopterAndLog } from "./12-copter_and_log.js";
import { GrFireworks } from "./12-fireworks.js";
import { GrCloth } from "./12-cloth.js";
import { ShinySculpture } from "./shinySculpture_v2.js";
import { House1, Church, Tree } from "./12-buildings.js";

/**
 * The Graphics Town Main -
 * This builds up the world and makes it go...
 */

// make the world
let world = new GrWorld({
    width: 800,
    height: 600,
    groundplanesize: 20 // make the ground plane big enough for a world of stuff
});


// put stuff into the world
// this calls the example code (that puts a lot of objects into the world)
// you can look at it for reference, but do not use it in your assignment
// main(world);

let ferrisWheel = new GrFerrisWheel({ x: 0, y: 0, z: 10, size: 0.5 });
world.add( ferrisWheel );

let thePoints = [
    [ -9., 0., -18. ],
    [ -18., 0., -9. ],
    [ -12., 0.,  0. ],
    [ -18., 0.,  9. ],
    [ -9., 0.,  18. ],
    [  0., 0.,  12. ],
    [  9., 0.,  18. ],
    [ 18., 0.,   9. ],
    [ 12., 0.,   0. ],
    [ 18., 0.,  -9. ],
    [  9., 0., -18. ],
    [  0., 0., -12. ],
  ];
let rail = new GrRail( thePoints, 0.0, { x: 0, y: 0.0, size: 1.0 } );
world.add( rail );

function shift( grObj, x=0., y=0., z=0. ){
    grObj.objects.forEach( obj => {
      obj.position.x += x;
      obj.position.y += y;
      obj.position.z += z;
    });
  }

// place the buildings and trees
let houses = [];
let house_num_h = 2;
let house_num_w = 3;
for( let house_idx1 = 0; house_idx1 < house_num_h; house_idx1++ ){
  for( let house_idx2 = 0; house_idx2 < house_num_w; house_idx2++ ){
    let house = new House1( 1.7 );
    shift( house, -8 - house_idx1 * 4.0, 0, -4 - house_idx2 * 4.0 );
    houses.push( house );
    world.add( houses[house_idx1*house_num_w+house_idx2] );
  }
}
let church1 = new Church( 1.7 );
shift( church1, -0.5, 0, -9 );
world.add( church1 );
  
let treels = [];
let treers = [];
for( let tree_idx = 0; tree_idx < 5; tree_idx++ ){
  let tree_l = new Tree();
  shift( tree_l, -13, 0, -13 + 2.2 * tree_idx );
  treels.push( tree_l );
  world.add( treels[tree_idx] );
  let tree_r = new Tree();
  shift( tree_r, -3.5, 0, -13 + 2.2 * tree_idx );
  treers.push( tree_r );
  world.add( treers[tree_idx] );
}

//// place the unplugged instruments: swings, roundabouts, seesaws
// swings
let swing_num = 4;
let swings = [];
for( let swing_idx = 0; swing_idx < swing_num; swing_idx++ ){
  let swing = new GrAdvancedSwing( { x: -13, z: 6 + 2 * swing_idx, size: 0.5 } );
  swings.push( swing );
  world.add( swings[swing_idx] );
}

// roundabouts
let round_num = 3;
let rounds = [];
for( let round_idx = 0; round_idx < round_num; round_idx++ ){
  let round = new GrColoredRoundabout( { x: -10, z: 5 + 4 * round_idx, size: 0.5 } );
  rounds.push( round );
  world.add( rounds[round_idx] );
}

// seesaws
let seesaw_num = 4;
let seesaws = [];
for( let seesaw_idx = 0; seesaw_idx < seesaw_num; seesaw_idx++ ){
  let seesaw = new GrSeesaw( { x: -7, z: 5 + 3 * seesaw_idx, rot_y: - Math.PI / 4, size: 0.3 } );
  seesaws.push( seesaw );
  world.add( seesaws[seesaw_idx] );
}


//// place the plugged instruments: rotating coffee cup, and the carousal
let coffeeCup = new GrCoffeeCup( { x: 9, z: 13, size: 0.8 } );
world.add( coffeeCup );

let carousel = new GrCarousel( { x: 14, z: 9, size: 0.8 } );
world.add( carousel );


let fireworks = new GrFireworks({size:1});
world.add( fireworks );


let copterAndLog = new GrCopterAndLog({size:1});
world.add( copterAndLog );


let cloth = new GrCloth({ x:7.5, z:-4, y:4.5, size:2 });
world.add( cloth );


let lion = new ShinySculpture( world, {} );
world.add( lion );

// while making your objects, be sure to identify some of them as "highlighted"

///////////////////////////////////////////////////////////////
// because I did not store the objects I want to highlight in variables, I need to look them up by name
// This code is included since it might be useful if you want to highlight your objects here
function highlight(obName) {
    const toHighlight = world.objects.find(ob => ob.name === obName);
    if (toHighlight) {
        toHighlight.highlighted = true;
    } else {
        throw `no object named ${obName} for highlighting!`;
    }
}
// of course, the student should highlight their own objects, not these
highlight("FerrisWheel-0");
highlight("Rail-0");
highlight("CoffeeCup-0");
highlight("Seesaw-0");
highlight("CopterAndLog-0");
highlight("Church-0");
highlight("House1-0");
highlight("Tree-0");
highlight("ShinyLion-0");
highlight("Fireworks-0");
highlight("Cloth-0");

///////////////////////////////////////////////////////////////
// build and run the UI
// only after all the objects exist can we build the UI
// @ts-ignore       // we're sticking a new thing into the world
world.ui = new WorldUI(world);
// now make it go!
world.go();
