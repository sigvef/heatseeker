uniform float t;
uniform sampler2D tDiffuse;
varying vec2 vUv;


float spiral(vec2 here, vec2 center, float time) {
    float distanceFromCenter = length(here - center);
    return sin(distanceFromCenter * 200. - time * 10.);
}


void main(void) {
    float zoom = 0.1 + 0.2 * t * t;
    vec2 here = sin(t / 10.) + (vUv - 0.5) / zoom;
    
    float spiral1 = spiral(here, vec2(0., 0.5), t);
    float spiral2 = spiral(here, vec2(1., 0.5), t);
    float spiral3 = spiral(here, vec2(0.5, 0.), t);
    float spiral4 = spiral(here, vec2(0.5, 1.), t);
    float spiral5 = spiral(here, vec2(0., 0), t);
    float spiral6 = spiral(here, vec2(1., 1.), t);
    float spiral7 = spiral(here, vec2(0, 1.), t);
    float spiral8 = spiral(here, vec2(1, 0.), t);
    
    float combined1 = spiral1 * spiral2 * spiral3 * spiral4 * spiral5 * spiral6 * spiral7 * spiral8;
    
    float flattened = (
        spiral1 +
        spiral2 +
        spiral3 +
        spiral4 +
        spiral5 +
        spiral6 +
        spiral7 +
        spiral8 +
        combined1);
    
    gl_FragColor = vec4(vec3(flattened), 1.);
}
