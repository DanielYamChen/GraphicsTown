/*jshint -W069, -W141, -W047, esversion: 6 */
// @ts-check

// these two things are the main UI code for the train
// students learned about them in last week's workbook

import * as T from "../libs/CS559-Three/build/three.module.js";

// this is a utility that adds a checkbox to the page 
// useful for turning features on and off

const scale = 0.5;
const train_l = 100, train_w = 40;
const tie_l = 10, tie_w = 50;
const car_color = [ "indigo", "forestgreen", "orangered" ];

/** @type Array<number[]> */
let thePoints = [
  [150, 150],
  [150, 450],
  [450, 450],
  [450, 150]
];

// draw the cubic cardinal spline by using Bezier curves
/**
 * @param {Array<number[]>} thePoints
 * @param {number} tension
 */
function drawCardinalCubic( thePoints, tension ){ 
  let prvs_idx = 0, nxt_idx = 0, tangent_s = [ 0., 0. ], tangent_e = [ 0., 0. ];
  let i_nxt = 0;

  let curvePoints = [];
  for( let i = 0; i < thePoints.length; i++ ){
    i_nxt = ( i + 1 ) % thePoints.length;
    if( i == 0 ){
      prvs_idx = ( i - 1 >= 0 ) ? ( i - 1 ) : ( i - 1 + thePoints.length );
      nxt_idx = ( i + 1 ) % thePoints.length;
      tangent_s[0] = ( thePoints[nxt_idx][0] - thePoints[prvs_idx][0] ) * ( 1 - tension ) / 2;
      tangent_s[1] = ( thePoints[nxt_idx][1] - thePoints[prvs_idx][1] ) * ( 1 - tension ) / 2;
    }
    prvs_idx = i;
    nxt_idx = ( i + 2 ) % thePoints.length;
    tangent_e[0] = ( thePoints[nxt_idx][0] - thePoints[prvs_idx][0] ) * ( 1 - tension ) / 2;
    tangent_e[1] = ( thePoints[nxt_idx][1] - thePoints[prvs_idx][1] ) * ( 1 - tension ) / 2;

    // Reference the code example on
    // https://threejs.org/docs/#api/en/extras/curves/CubicBezierCurve3
    let curve = new T.CubicBezierCurve3(
      new T.Vector3( thePoints[i][0], 0, thePoints[i][1] ),
      new T.Vector3( thePoints[i][0] + tangent_s[0]/3, 0, thePoints[i][1] + tangent_s[1]/3 ),
      new T.Vector3( thePoints[i_nxt][0] - tangent_e[0]/3, 0, thePoints[i_nxt][1] - tangent_e[1]/3 ),
      new T.Vector3( thePoints[i_nxt][0], 0, thePoints[i_nxt][1] )
    );
    tangent_s[0] = tangent_e[0];
    tangent_s[1] = tangent_e[1];
    curvePoints.concat( curve.getPoints( 100 ) );
  }

  const curveGeom = new T.BufferGeometry().setFromPoints( curvePoints );
  const curveMat = new T.LineBasicMaterial( { color : 0xff0000, linewidth: 3 } );

  // Create the final rail object
   T.Line( curveGeom, curveMat );

  context.save();
    context.strokeStyle = "black";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo( thePoints[0][0], thePoints[0][1]);  
    for(let i = 0; i < thePoints.length; i++ ){
      i_nxt = ( i + 1 ) % thePoints.length;
      if( i == 0 ){
        prvs_idx = ( i - 1 >= 0 ) ? ( i - 1 ) : ( i - 1 + thePoints.length );
        nxt_idx = ( i + 1 ) % thePoints.length;
        tangent_s[0] = ( thePoints[nxt_idx][0] - thePoints[prvs_idx][0] ) * ( 1 - tension ) / 2;
        tangent_s[1] = ( thePoints[nxt_idx][1] - thePoints[prvs_idx][1] ) * ( 1 - tension ) / 2;
      }
      prvs_idx = i;
      nxt_idx = ( i + 2 ) % thePoints.length;
      tangent_e[0] = ( thePoints[nxt_idx][0] - thePoints[prvs_idx][0] ) * ( 1 - tension ) / 2;
      tangent_e[1] = ( thePoints[nxt_idx][1] - thePoints[prvs_idx][1] ) * ( 1 - tension ) / 2;

      context.bezierCurveTo( thePoints[i][0] + tangent_s[0]/3, thePoints[i][1] + tangent_s[1]/3,
                            thePoints[i_nxt][0] - tangent_e[0]/3, thePoints[i_nxt][1] - tangent_e[1]/3,
                            thePoints[i_nxt][0], thePoints[i_nxt][1] );
      tangent_s[0] = tangent_e[0];
      tangent_s[1] = tangent_e[1];
    }
    context.closePath();
    context.stroke();
  context.restore();
}

// draw the train head
/**
 * @param {number} s
 * @param {number} x
 * @param {number} y
 * @param {number} theta
 */
function drawTrainHead( context, s, x, y, theta ){
  context.save();
    context.translate( x, y );
    context.rotate( theta );
    context.scale( s, s );
    
    context.fillStyle = "dimgrey";
    context.fillRect( -train_l/2, -train_w/2, train_l, train_w );
    context.fillStyle = "red";
    context.beginPath();
    context.arc( train_l/3, 0, train_w/2 * 0.7, 0, Math.PI * 2 );
    context.closePath();
    context.fill();
  context.restore();
}

// draw a train car
/**
 * @param {number} s
 * @param {number} x
 * @param {number} y
 * @param {number} theta
 * @param {string} color
 */
 function drawTrainCar( context, s, x, y, theta, color ){
  context.save();
    context.translate( x, y );
    context.rotate( theta );
    context.scale( s, s );
    
    context.fillStyle = color;
    context.fillRect( -train_l/2, -train_w/2, train_l, train_w );
  context.restore();
}

// calculate the position and orientation of the train head based on
// the normal parameter
/**
 * @param {Array<number[]>} thePoints
 * @param {number} t_tot
 * @param {number} tension
 */
function calcTrainHeadPos( thePoints, t_tot, tension ){
  if( t_tot == thePoints.length )
    t_tot = 0;
  let seg_idx = Math.floor(t_tot);
  let u = t_tot - seg_idx;
  let pt_s = thePoints[seg_idx];
  let pt_e = thePoints[ ( seg_idx + 1 ) % thePoints.length ];
  
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

  let prvs_idx = ( seg_idx - 1 >= 0 ) ? ( seg_idx - 1 ) : ( seg_idx - 1 + thePoints.length );
  let pt_s_prime = [ ( pt_e[0] - thePoints[prvs_idx][0] )  * ( 1 - tension ) / 2,
                     ( pt_e[1] - thePoints[prvs_idx][1] )  * ( 1 - tension ) / 2 ];
  let nxt_idx = ( seg_idx + 2 ) % thePoints.length;
  let pt_e_prime = [ ( thePoints[nxt_idx][0] - pt_s[0] )  * ( 1 - tension ) / 2,
                     ( thePoints[nxt_idx][1] - pt_s[1] )  * ( 1 - tension ) / 2 ];
  return [ base_func[0]*pt_s[0] + base_func[1]*pt_s_prime[0] + base_func[2]*pt_e[0] + base_func[3]*pt_e_prime[0],
           base_func[0]*pt_s[1] + base_func[1]*pt_s_prime[1] + base_func[2]*pt_e[1] + base_func[3]*pt_e_prime[1],
           Math.atan2( bas_prime[0]*pt_s[1] + bas_prime[1]*pt_s_prime[1] + bas_prime[2]*pt_e[1] + bas_prime[3]*pt_e_prime[1],
                       bas_prime[0]*pt_s[0] + bas_prime[1]*pt_s_prime[0] + bas_prime[2]*pt_e[0] + bas_prime[3]*pt_e_prime[0] ) ];
}

// buid the table between the normal param and arc-length param
/**
 * @param {Array<number[]>} thePoints
 * @param {number} tension
 */
function buildArcTable( thePoints, tension ){
  let i_nxt = 0;
  let seg_num = 0;
  let t_s_table = [];
  let small_s = [ 0., 0., 0. ], small_e = [ 0., 0., 0. ];
  let small_arc = 0.;
  let arc_length = 0.;

  t_s_table.push([ 0., 0. ]);
  for( let i = 0; i < thePoints.length; i++ ){
    i_nxt = ( i + 1 ) % thePoints.length;
    seg_num = Math.sqrt( Math.pow( thePoints[i_nxt][0] - thePoints[i][0], 2 ) + Math.pow( thePoints[i_nxt][1] - thePoints[i][1], 2 ) );
    seg_num = Math.round( ( seg_num / 1 ) );
    for( let j = 1 / seg_num; j <= 1 + 1e-6; j = j + 1 / seg_num ){
      small_s = calcTrainHeadPos( thePoints, Math.max( i + j - 1 / seg_num, 0 ), tension );
      small_e = calcTrainHeadPos( thePoints, Math.min( i + j, i + 1 ), tension );
      small_arc = Math.sqrt( Math.pow( small_s[0] - small_e[0], 2 ) + Math.pow( small_s[1] - small_e[1], 2 ) );
      arc_length = arc_length + small_arc;
      t_s_table.push([ Math.min( i + j, i + 1 ), arc_length ]);
    }
  }
  t_s_table.forEach( function(pair){
    pair[1] = pair[1] / arc_length * thePoints.length;
  });
  
  return [ t_s_table, arc_length ];
}

// look up the corresponding normal param based on arc-length param and
// the table
/**
 * @param {Array<number[]>} t_s_table
 * @param {number} s
 */
function t_of_s( t_s_table, s ){
  let i_idx = 0, f_idx = t_s_table.length - 1 ;
  let t_idx = Math.round( i_idx + f_idx / 2 );

  while( ( s - t_s_table[t_idx][1] ) * ( s - t_s_table[t_idx+1][1] ) > 0){
    if( s - t_s_table[t_idx][1] > 0 ){
      t_idx = t_idx + 1;
    } else {
      t_idx = t_idx - 1;
    }
  }
  
  return t_s_table[t_idx][0];
}

// look up the corresponding arc-length param based on normal param and
// the table
/**
 * @param {Array<number[]>} t_s_table
 * @param {number} t
 */
function s_of_t( t_s_table, t ){
  let i_idx = 0, f_idx = t_s_table.length - 1 ;
  let s_idx = Math.round( i_idx + f_idx / 2 );

  while( ( t - t_s_table[s_idx][0] ) * ( t - t_s_table[s_idx+1][0] ) > 0){
    if( t - t_s_table[s_idx][0] > 0 ){
      s_idx = s_idx + 1;
    } else {
      s_idx = s_idx - 1;
    }
  }
  
  return t_s_table[s_idx][1];
}

// draw a rail tie
/**
 * @param {number} s
 * @param {number} x
 * @param {number} y
 * @param {number} theta
 */
 function drawRailTie( context, s, x, y, theta ){
  context.save();
    context.translate( x, y );
    context.rotate( theta );
    context.scale( s, s );
    
    context.fillStyle = "brown";
    context.fillRect( -tie_l/2, -tie_w/2, tie_l, tie_w );
  context.restore();
}

// draw the all rail ties
/**
 * @param {Array<number[]>} t_s_table
 * @param {Array<number[]>} thePoints
 * @param {number} tension
 */
function drawRailTieGroup( context, thePoints, t_s_table, tension ){
  const tie_seg = 0.02 * thePoints.length;
  let t = 0.;
  let tie_x = 0., tie_y = 0., tie_theta = 0.;
  for(let i = 0; i < thePoints.length; i = i + tie_seg ){
    t = t_of_s( t_s_table, i );
    [ tie_x, tie_y, tie_theta ] = calcTrainHeadPos( thePoints, t, tension );
    drawRailTie( context, scale, tie_x, tie_y, tie_theta );
  }
}

// draw two parallel rail curves
/**
 * @param {Array<number[]>} t_s_table
 * @param {Array<number[]>} thePoints
 * @param {number} tension
 */
function drawParallelRails( context, thePoints, t_s_table, tension ){
  const rail_seg = 0.0005 * thePoints.length;
  let t = 0.;
  let rail_x = 0., rail_y = 0., rail_theta = 0.;
  context.save();
    context.strokeStyle = "black";
    context.lineWidth = 2;
    for( let j = 0; j < 2; j++ ){
      context.beginPath();
      [ rail_x, rail_y, rail_theta ] = calcTrainHeadPos( thePoints, t, tension );
      context.save();
        context.translate( rail_x, rail_y );
        context.rotate( rail_theta );
        context.moveTo( 0, Math.pow(-1,j%2)*tie_w*scale*0.6/2 );
      context.restore();
      
      // draw the parallel rail curve based on small line-by-line
      for(let i = rail_seg; i < thePoints.length; i = i + rail_seg ){
        t = t_of_s( t_s_table, i );
        [ rail_x, rail_y, rail_theta ] = calcTrainHeadPos( thePoints, t, tension );
        context.save();
          context.translate( rail_x, rail_y );
          context.rotate( rail_theta );
          context.lineTo( 0, Math.pow(-1,j%2)*tie_w*scale*0.6/2 );
        context.restore();
      }
      context.closePath();
      context.stroke();
    }
  context.restore();
}

let arcLengthCheck;
let simpleTrackCheck;
let tensionSlider;
let tensionShow;
/**
 * Draw function - this is the meat of the operation
 *
 * It's the main thing that needs to be changed
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number} slider_value
 * @param {boolean} isArcLength
 * @param {boolean} isSimpleTrack
 * @param {number} tension
 */
function draw(canvas, slider_value, isArcLength, isSimpleTrack, tension ) {
  
  let context = canvas.getContext("2d");
  let t = 0.; // normal param
  let s = 0.; // arc-length param

  // clear the screen
  context.clearRect(0, 0, canvas.width, canvas.height);

  // draw the control points
  thePoints.forEach(function(pt) {
    context.beginPath();
    context.arc(pt[0], pt[1], 5, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  });

  // now, the student should add code to draw the track and train
  // get the normal and arc-length param table and total arc length of the rail
  let [ t_s_table, arc_length ] = buildArcTable( thePoints, tension ); 
  
  if( isSimpleTrack == false ){
    // draw the rail ties and parallel rail curves
    drawRailTieGroup( context, thePoints, t_s_table, tension );
    drawParallelRails( context, thePoints, t_s_table, tension );
  } else{ 
    // draw a simple rail curve
    drawCardinalCubic( context, thePoints, tension );
  }

  let head_x = 0., head_y = 0., head_theta = 0.;
  let car_x = new Array(3);
  let car_y = new Array(3);
  let car_theta = new Array(3);
  let Car_dist = train_l * 0.55 / arc_length * thePoints.length;
  if( isArcLength ){ // the slider value is for arc-length param
    s = slider_value;
    t = t_of_s( t_s_table, s );
    [ head_x, head_y, head_theta ] = calcTrainHeadPos( thePoints, t, tension );
    for( let i=0; i<car_x.length; i++ ){
      // get the arc-length param of train car by the arc-length param of train head
      s = slider_value - ( i + 1 ) * Car_dist;
      s = ( s >= 0 ) ? s : ( s + thePoints.length );
      // calculate the corresponding normal param from the arc-length param of the train car
      t = t_of_s( t_s_table, s );
      [ car_x[i], car_y[i], car_theta[i] ] = calcTrainHeadPos( thePoints, t, tension );
    }
  } else{ // the slider value is for normal param
    t = slider_value;
    [ head_x, head_y, head_theta ] = calcTrainHeadPos( thePoints, t, tension );
    for( let i=0; i<car_x.length; i++ ){
      // firstly trasform the arc-length param of train head to normal param, then
      s = s_of_t( t_s_table, t );
      // get the arc-length param of train car by the arc-length param of train head
      s = s - Car_dist;
      s = ( s >= 0 ) ? s : ( s + thePoints.length );
      // calculate the corresponding arc-length param from the arc-length param of the train car
      t = t_of_s( t_s_table, s );
      [ car_x[i], car_y[i], car_theta[i] ] = calcTrainHeadPos( thePoints, t, tension );
    }
  }
  
  // draw the train
  drawTrainHead( context, scale, head_x, head_y, head_theta );
  for( let i=0; i<car_x.length; i++ ){
    drawTrainCar( context, scale, car_x[i], car_y[i], car_theta[i], car_color[i] );
  }
  
}



/**
 * Initialization code - sets up the UI and start the train
 */
{
  let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById(
    "canvas1"
  ));
  let context = canvas.getContext("2d");
  // we need the slider for the draw function, but we need the draw function
  // to create the slider - so create a variable and we'll change it later
  let slider; // = undefined;

  // note: we wrap the draw call so we can pass the right arguments
  function wrapDraw() {
    // do modular arithmetic since the end of the track should be the beginning
    draw(canvas, Number(slider.value) % thePoints.length, arcLengthCheck.checked, simpleTrackCheck.checked, Number(tensionSlider.value) );
  }
  // create a UI
  let runcavas = new RunCanvas(canvas, wrapDraw);
  // now we can connect the draw function correctly
  slider = runcavas.range;

  // note: if you add these features, uncomment the lines for the checkboxes
  // in your code, you can test if the checkbox is checked by something like:
  // document.getElementById("check-simple-track").checked
  // in your drawing code
  // WARNING: makeCheckbox adds a "check-" to the id of the checkboxes
  //
  // lines to uncomment to make checkboxes
  makeCheckbox("simple-track");
  simpleTrackCheck = /** @type {HTMLInputElement} */ ( document.getElementById("check-simple-track") );
  makeCheckbox("arc-length");
  arcLengthCheck = /** @type {HTMLInputElement} */ ( document.getElementById("check-arc-length") );
  // makeCheckbox("bspline");
  tensionSlider = /** @type {HTMLInputElement} */ ( document.getElementById("tensionSlider") );
  tensionShow = /** @type {HTMLInputElement} */ ( document.getElementById("tensionShow") );
  tensionShow.value = Number(tensionSlider.value).toFixed(2);

  // helper function - set the slider to have max = # of control points
  function setNumPoints() {
    runcavas.setupSlider(0, thePoints.length, 0.05);
  }

  setNumPoints();
  runcavas.setValue(0);

  // add the point dragging UI
  draggablePoints(canvas, thePoints, wrapDraw, 10, setNumPoints);
  
  arcLengthCheck.onclick = function(){
    wrapDraw();
  };

  simpleTrackCheck.onclick = function(){
    wrapDraw();
  };

  tensionSlider.oninput = function(){
    tensionShow.value = Number(tensionSlider.value).toFixed(2);
    wrapDraw();
  }  
}
