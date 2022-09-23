/*jshint -W047, esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

// define your buildings here - remember, they need to be imported
// into the "main" program
let house1ObCtr = 0;
export class House1 extends GrObject {
  constructor( house_w=1.0 ){ 
    // build a house geometry composed of some triangles
    let geom = new T.Geometry();
    geom.vertices.push( new T.Vector3( 0, house_w, house_w ) ); // 0
    geom.vertices.push( new T.Vector3( 0, 0, house_w ) ); // 1
    geom.vertices.push( new T.Vector3( 2 * house_w, 0, house_w ) ); // 2
    geom.vertices.push( new T.Vector3( 2 * house_w, house_w, house_w ) ); // 3
    geom.vertices.push( new T.Vector3( 2 * house_w, house_w, 0 ) ); // 4
    geom.vertices.push( new T.Vector3( 2 * house_w, 0, 0 ) ); // 5
    geom.vertices.push( new T.Vector3( 0, 0, 0 ) ); // 6
    geom.vertices.push( new T.Vector3( 0, house_w, 0 ) ); // 7
    geom.vertices.push( new T.Vector3( 0.3*house_w, 1.33*house_w, 0.5*house_w ) ); // 8
    geom.vertices.push( new T.Vector3( 1.7*house_w, 1.33*house_w, 0.5*house_w ) ); // 9
    // build the faces
    const faceVertexTable = [ [0,1,2],[0,2,3],[3,2,5],[3,5,4],[4,5,6],
                              [4,6,7],[7,6,1],[7,1,0],[8,0,3],[8,3,9],
                              [9,3,4],[9,4,7],[9,7,8],[8,7,0]]; 
    faceVertexTable.forEach( faceVertexId => {
        geom.faces.push( new T.Face3( ...faceVertexId ) );
    });
    geom.computeFaceNormals();
    
    // build the texture
    // let mat = new T.MeshStandardMaterial( { roughness: 0.5, color: "white" } );
    // build the texture
    const vertexTextureTable = [ [ [0,0], [0,1/3], [1,1/3] ],
                                 [ [0,0], [1,1/3], [ 1, 0] ],
                                 [ [0,1/3], [0,2/3], [1/2,2/3] ],
                                 [ [0,1/3], [1/2,2/3], [1/2,1/3] ],
                                 [ [0,1/3], [0,2/3], [1,2/3] ],
                                 [ [0,1/3], [1,2/3], [1,1/3] ],
                                 [ [0,1/3], [0,2/3], [1/2,2/3] ],
                                 [ [0,1/3], [1/2,2/3], [1/2,1/3] ],
                                 [ [0,2/3], [0,1], [1/2,1] ],
                                 [ [0,2/3], [1/2,1], [1/2,2/3] ],
                                 [ [1/4,2/3], [0,1], [1/2,1] ],
                                 [ [0,2/3], [0,1], [1/2,1] ],
                                 [ [0,2/3], [1/2,1], [1/2,2/3] ],
                                 [ [1/4,2/3], [0,1], [1/2,1] ]
                                ];
    let faceVs = [];
    vertexTextureTable.forEach( faceVertexId => {
      faceVs.push([ new T.Vector2(...faceVertexId[0]),
                    new T.Vector2(...faceVertexId[1]),
                    new T.Vector2(...faceVertexId[2]) ] );
    });
    geom.faceVertexUvs = [ faceVs ];
    // load the texture
    let fcg = new T.TextureLoader().load( "./images/house1.jpg" );
    fcg.flipY = false;
    let mat = new T.MeshStandardMaterial({ color:"white", map:fcg });                     
    
    let mesh = new T.Mesh( geom, mat );
    super( `House1-${house1ObCtr++}`, mesh );
  }
}

let churchObCtr = 0;
export class Church extends GrObject {
  constructor( church_w=1.0 ){ 
    // build a house geometry composed of some triangles
    let group = new T.Group();
    
    let crossMaterial = new T.MeshStandardMaterial({color: 0xEEEEEE,  metalness: 0., roughness: 1.0 });

    let cross1Shape = new T.BoxGeometry(church_w*4/5, church_w/10, church_w/10 );
    let cross1 = new T.Mesh( cross1Shape, crossMaterial );
    cross1.position.x = church_w;
    cross1.position.y = 2.6 * church_w;
    cross1.position.z = church_w;
    group.add( cross1 );

    let cross2Shape = new T.BoxGeometry(church_w/10, church_w, church_w/10 );
    let cross2 = new T.Mesh( cross2Shape, crossMaterial );
    cross2.position.x = church_w;
    cross2.position.y = 2.4 * church_w;
    cross2.position.z = church_w;
    group.add( cross2 );

    let geom = new T.Geometry();
    geom.vertices.push( new T.Vector3( 0, church_w, 2 * church_w ) ); // 0
    geom.vertices.push( new T.Vector3( 0, 0, 2 * church_w ) ); // 1
    geom.vertices.push( new T.Vector3( 2 * church_w, 0, 2 * church_w ) ); // 2
    geom.vertices.push( new T.Vector3( 2 * church_w, church_w, 2 * church_w ) ); // 3
    geom.vertices.push( new T.Vector3( 2 * church_w, church_w, 0 ) ); // 4
    geom.vertices.push( new T.Vector3( 2 * church_w, 0, 0 ) ); // 5
    geom.vertices.push( new T.Vector3( 0, 0, 0 ) ); // 6
    geom.vertices.push( new T.Vector3( 0, church_w, 0 ) ); // 7
    geom.vertices.push( new T.Vector3( church_w, 2 * church_w, church_w ) ); // 8
    // build the faces
    const faceVertexTable = [ [0,1,2],[0,2,3],[3,2,5],[3,5,4],[4,5,6],
                              [4,6,7],[7,6,1],[7,1,0],[8,0,3],[8,3,4],
                              [8,4,7],[8,7,0] ]; 
    faceVertexTable.forEach( faceVertexId => {
        geom.faces.push( new T.Face3( ...faceVertexId ) );
    });
    geom.computeFaceNormals();
    
    // build the texture
    // let mat = new T.MeshStandardMaterial( { roughness: 0.5, color: "white" } );
    // build the texture
    const vertexTextureTable = [ [ [0,0], [0,1], [1,1] ],
                                 [ [0,0], [1,1], [1,0] ],
                                 [ [0,0], [0,1], [1,1] ],
                                 [ [0,0], [1,1], [1,0] ],
                                 [ [0,0], [0,1], [1,1] ],
                                 [ [0,0], [1,1], [1,0] ],
                                 [ [0,0], [0,1], [1,1] ],
                                 [ [0,0], [1,1], [1,0] ]
                                ];
    let faceVs = [];
    vertexTextureTable.forEach( faceVertexId => {
      faceVs.push([ new T.Vector2(...faceVertexId[0]),
                    new T.Vector2(...faceVertexId[1]),
                    new T.Vector2(...faceVertexId[2]) ] );
    });
    geom.faceVertexUvs = [ faceVs ];
    // load the texture
    let fcg = new T.TextureLoader().load( "./images/church.jpg" );
    fcg.flipY = false;
    let mat = new T.MeshStandardMaterial({ color:"white", map:fcg });                     
    
    let mesh = new T.Mesh( geom, mat );
    group.add( mesh );
    super( `Church-${churchObCtr++}`, group );
  }
}

let treeObCtr = 0;
export class Tree extends GrObject {
  constructor( tree_w = 0.1 ){
    let tree1Material = new T.MeshStandardMaterial({color: "forestgreen",  metalness: 0., roughness: 1.0 });
    let tree1Shape = new T.ConeGeometry( tree_w*5, tree_w*10, 64 );
    let tree1 = new T.Mesh( tree1Shape, tree1Material );
    let tree2Material = new T.MeshStandardMaterial({color: "saddlebrown",  metalness: 0., roughness: 1.0 });
    let tree2Shape = new T.CylinderGeometry( tree_w, tree_w*2, tree_w*10 );
    let tree2 = new T.Mesh( tree2Shape, tree2Material );
    tree2.position.y = tree2Shape.parameters.height / 2;
    tree1.position.y = tree1Shape.parameters.height / 2 - tree_w;
    
    tree2.add(tree1);
    
    super( `Tree-${treeObCtr++}`, tree2 );
  }
}