// raymarching structure rrom shadertoy

uniform float time;
uniform sampler2D tDiffuse;
uniform sampler2D video;
varying vec2 vUv;

const float EPSILON = 0.00001;
const int MAX_ITERATIONS = 100;
const float MAX_DEPTH = 128.0;

struct Camera
{
    vec3 position;
    vec3 dir;
    vec3 up;
    vec3 rayDir;
    vec2 screenPosition;
};

struct Material
{
    vec3 color;
};
    
struct MapResult
{
    float dist;
    Material material;
};
    
struct MarchResult
{
    MapResult hit;
    vec3 position;
    vec3 normal;
};
    
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

vec3 smin( vec3 a, vec3 b, float k )
{
    return vec3(smin(a.x, b.x, k),
                smin(a.y, b.y, k),
                smin(a.z, b.z, k));
}

float smax(float a, float b, float k) {
    return -smin(-a, -b, k);   
}

Camera getCamera(in vec3 dir, in vec3 position, in vec3 up)
{
    Camera cam;
    cam.dir = dir;
    cam.position = position;
    cam.up = up;
    vec3 forward = normalize(cam.dir - cam.position);
    vec3 left = cross(forward, cam.up);
    cam.up = cross(left, forward);
 
    vec3 screenOrigin = (cam.position+forward);
    cam.screenPosition = 2.0*vUv - 1.0;
    float screenAspectRatio = 16. / 9.;
    vec3 screenHit = screenOrigin + cam.screenPosition.x * left * screenAspectRatio + cam.screenPosition.y * cam.up;
  
    cam.rayDir = normalize(screenHit-cam.position);
    return cam;
}

mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat4(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0,
            oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0,
            oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0,
            0.0, 0.0, 0.0, 1.0);
}

MapResult combine(MapResult a, MapResult b)
{
    if(a.dist < b.dist)
    {
        a.dist = smin(a.dist, b.dist, 1.);
        a.material.color = mix(a.material.color, b.material.color, abs(a.dist - b.dist));
        return a;   
    }
    b.material.color = mix(a.material.color, b.material.color, abs(a.dist - b.dist));
    b.dist = smin(a.dist, b.dist, 1.);
    return b;
}

MapResult map_cube(vec3 position)
{
    MapResult result;
    result.material.color = vec3(1.0, 0.5, 0.2);
    float cube = length(max(abs(position) - vec3(.8), 0.0)) - 0.;
    float sphere = length(position) - 1.2;
    result.dist = sphere;
    return result;
}


vec3 plasma(vec2 pos, float time) {
    const float PI = 3.14159265;
    float color1, color2, color;
    color1 = (sin(dot(pos,vec2(sin(time*3.0),cos(time*3.0)))*0.02+time*3.0)+1.0)/2.0;
    vec2 center = vec2(.5, .5) + vec2(.5*sin(-time*3.0),.5*cos(-time*3.0));
    color2 = (cos(length(pos - center)*0.03)+1.0)/2.0;
    color = (color1+ color2)/2.0;
    float red   = (cos(PI*color/0.5+time*3.0)+1.0)/2.0;
    float green = (sin(PI*color/0.5+time*3.0)+1.0)/2.0;
    float blue  = (sin(+time*3.0)+1.0)/2.0;
    return vec3(red, green, blue);
}

MapResult map_plasmacube(vec3 position, float timeOffset, float timeScale, float scale)
{
    float t = time * timeScale + timeOffset;
    MapResult result;
    result.material.color = plasma(gl_FragCoord.xy * 3., t * 0.1) + 
                            0.1 * (vec3(plasma(gl_FragCoord.xy * 5., t * 0.1).x, 0., 0.));
    float cube = length(max(abs(position) - vec3(scale), 0.0)) - 0.;
    float d = cube;
    d = 1.2 * length(position) - 2. * length(plasma(gl_FragCoord.xy * 3. * scale, t * 0.1));
    d = smin(d, length(position) - .2 * plasma(gl_FragCoord.xy * 5. * scale, t * 0.1).x, 0.5);
    d = max(cube, d);
    result.dist = d;
    return result;
}


MapResult map(vec3 position)
{
    MapResult result;
    result = map_plasmacube(position, 0., 1., 1.2);
    result = combine(result, map_cube(position));
    return result;
}

MarchResult raymarch(const in Camera cam)
{
    MarchResult march;
    
    float depth = 0.0;
    for(int i = 0; i < MAX_ITERATIONS; ++i)
    {
        march.position = cam.position + cam.rayDir * depth;
        march.hit = map(march.position);
        
        
        if(march.hit.dist <= EPSILON || depth >= MAX_DEPTH)
        {
            break;
        }
        
        depth += march.hit.dist;
    }
    
    if(depth < MAX_DEPTH)
    {
        vec3 eps = vec3(EPSILON, 0, 0);
        march.normal=normalize(
               vec3(march.hit.dist - map(march.position-eps.xyy).dist,
                    march.hit.dist - map(march.position-eps.yxy).dist,
                    march.hit.dist - map(march.position-eps.yyx).dist));
        
    }
    
    return march;
}

vec3 getColor(const in Camera cam, const in MarchResult march)
{   
    float lambert = dot(march.normal, -cam.rayDir);
    
    vec3 color = lambert * march.hit.material.color;
    
    return color;
}

void main() 
{   
    // Set up camera
    vec3 cam_dir = vec3(0, sin(time * 2.1), 0);
    vec3 cam_position = vec3(sin(time * 2.) * -4.0, 5., cos(time * 2.) * -4.0);
    vec3 cam_up = vec3(0,1,0);
    
    Camera cam = getCamera(cam_dir, cam_position, cam_up);
    
    // Raymarch
    MarchResult result = raymarch(cam);
    
    vec3 color = getColor(cam, result);

    vec3 lighting = vec3(1.);
    lighting = clamp(vec3(0.), vec3(1.), lighting);
    if(vUv.y < .5) {
        vec2 coords = vec2(gl_FragCoord.x, -gl_FragCoord.y);
        lighting *= plasma(coords * 3., time * 0.1) + 
                0.1 * (vec3(plasma(coords * 5., time * 0.1).x, 0., 0.));
        lighting += .0 + vec3(1. * (4. * length(vUv - vec2(.5, .1))));
        lighting = clamp(vec3(0.), vec3(1.), lighting);
    }
    lighting *= vec3(2. - 3. * vUv.y);
    lighting = clamp(vec3(0.), vec3(1.), lighting);
    vec4 outp = texture2D(video, vUv * vec2(1., 3. / 2.));
    outp *= vec4(lighting, 1.);
    if(vUv.y > 2. / 3.) {
        outp = vec4(0.3 * (1. - lighting) * vec3(.7, .7, 1.), 1.);
    }
    outp += 0.2;
    outp *= vec4(0.7, 0.7, 1., 1.);
    if(length(color) > 0.) {
        outp = vec4(color, 1.);
    }

    outp = mix(vec4(1.), outp, clamp(0., 1., time * 60. / 5.));

    gl_FragColor = outp;
}
