uniform vec3 color;
uniform sampler2D tDiffuse;

varying vec3 vColor;
varying float fAlpha;

void main() {

    gl_FragColor = vec4(color * vColor, fAlpha) * texture2D(tDiffuse, gl_PointCoord );

}
