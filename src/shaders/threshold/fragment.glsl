uniform float threshold;
uniform sampler2D tDiffuse;
uniform sampler2D tDiffuse2;
uniform sampler2D thresholdMap;
varying vec2 vUv;

void main() {
    vec4 fragColor = texture2D(tDiffuse, vUv);
    vec4 fragColor2 = texture2D(tDiffuse2, vUv);
    vec4 thresholdSample = texture2D(thresholdMap, vUv);

    if(thresholdSample.g < threshold) {
        gl_FragColor = fragColor;
    } else {
        gl_FragColor = fragColor2;
        /*
        gl_FragColor = mix(fragColor,
                           fragColor2,
                           smoothstep(
                               0., 1.,
                               clamp(
                                   0., 1., (thresholdSample.g - threshold) * 127.)
                                                ));
                                                */
    }
}
