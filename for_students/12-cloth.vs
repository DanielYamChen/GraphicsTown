/*
 * Simple Shader for exercise 8-1
 * The student should make this more interesting, but the interesting parts
 * might be the fragment shader.
  */

/* pass interpolated variables to the fragment */
varying vec2 v_uv;
varying vec3 v_normal;
uniform float time;

/* the vertex shader just passes stuff to the fragment shader after doing the
 * appropriate transformations of the vertex information
 */
void main() {
    // pass the texture coordinate to the fragment
    v_uv = uv;
    vec3 pos = position;
    v_normal = normalMatrix * normal;
    pos.z = position.z + ( 1.0 - uv.y ) * sin( 10.0 * uv.x + 0.005 * time );

    // the main output of the shader (the vertex position)
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}
