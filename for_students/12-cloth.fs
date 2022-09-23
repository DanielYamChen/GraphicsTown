/* Procedural shading example for Exercise 8-1 */
/* the student should make this more interesting */

/* pass interpolated variables to from the vertex */
varying vec2 v_uv;
const float star_num = 6.;
const vec3 bright = vec3( 0.65, 0.16, 0.16 );
const vec3 dark = vec3( 1., 1., 1. );

varying vec3 v_normal;
const vec3 lightDir = vec3( 0, 0.707, 0.707 );

void main()
{
    // create the procedural texture, used the code from Page 6
    float x = v_uv.x * star_num;
    float y = v_uv.y * star_num;

    float xc = floor(x);
    float yc = floor(y);

    float delta_x = x - xc - 0.5;
    float delta_y = y - yc - 0.5;
    float dc1 = step( - delta_y - 0.2, 0.0 );
    float dc2 = step( 1.5 * delta_x + delta_y - 0.4, 0.0 );
    float dc3 = step( - 1.5 * delta_x + delta_y - 0.4, 0.0 );
    float dc4 = step( 1.5 * delta_x - delta_y - 0.4, 0.0 );
    float dc5 = step( - 1.5 * delta_x - delta_y - 0.4, 0.0 );
    float dc6 = step( delta_y - 0.2, 0.0 );
    float dc = dc1 * dc2 * dc3;
    float dc_ = dc4 * dc5 * dc6;
    dc = 1. - ( 1. - dc ) * ( 1. - dc_ );

    // compute the lighting amount
    vec3 nhat = normalize( v_normal );
    float lightAmount = dot( nhat, lightDir );

    gl_FragColor = vec4( lightAmount * mix( bright, dark, dc ), 1.);
}
