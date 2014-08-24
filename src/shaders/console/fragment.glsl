#define DETECT_BLINK 1.5
#define DETECT_BORDER 4.0
#define DETECT_CROSS 8.0
#define DETECT_SEQUENCE 10.0

uniform float t;
uniform float amount;
uniform float opacity;
uniform sampler2D tDiffuse;
varying vec2 vUv;


// round box distance function
float roundBox(vec2 p, vec2 b, float r) {
    return length(max(abs(p)-b,0.0))-r;
}

// pixel coordinate to screen value, with scanline and glitches etc
vec3 getScreen(vec2 p, vec2 vUv) {
    
    // fade to black on outside
    float boundValue = roundBox(p, vec2(0.72, 0.6), 0.1 + (1. - amount))*5.0;
    boundValue = 1.0 - clamp(boundValue, 0.0, 1.0);
    
    // screen scanline
    float scanline = sin(p.y*3.1415*110.0)*.5+.5;
    //scanline = sqrt(scanline);
    scanline = 0.3 * scanline + 0.7;
    
    // get the screen content
    vec3 color = texture2D(tDiffuse, vUv).xyz;
    
    // and blend everything together
    float factor = scanline*boundValue;
    return mix(
            color, 
            mix(color + vec3(-color.r * 0.3, 0,color.b*0.8), amount*color*factor*.6+vec3(0, factor*color.g*.8, 0), amount),
            opacity);
}

void main(void) {
    
    // move the point away from the center
    vec2 p = vUv * 2.0 - 1.0;
    p += p*dot(p, p)*0.22;
    
    
    gl_FragColor = vec4(getScreen(p, vUv), 1.);
}
