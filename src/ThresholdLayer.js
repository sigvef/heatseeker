function ThresholdLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.threshold);
  this.shaderPass.uniforms.thresholdMap.value = Loader.loadTexture('res/vortex.png');

  this.renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
    this.fbo = new THREE.WebGLRenderTarget( 16 * GU, 9 * GU, this.renderTargetParameters );

  this.tunnelLayer = new TunnelLayer();

  this.shaderPass.uniforms.tDiffuse2.value = this.fbo;
  var render = this.shaderPass.render;
  var that = this;
  this.shaderPass.render = function(a, b, c, d, etc) {
    that.tunnelLayer.renderPass.render(demo.renderer, null, that.fbo, true);
    render.call(that.shaderPass, a, b, c, d, etc);
  }
}

ThresholdLayer.prototype.resize = function() {
  this.tunnelLayer.resize();
  this.fbo = new THREE.WebGLRenderTarget( 16 * GU, 9 * GU, this.renderTargetParameters );
  this.shaderPass.uniforms.tDiffuse2.value = this.fbo;

};

ThresholdLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

ThresholdLayer.prototype.update = function(frame, relativeFrame) {
  this.shaderPass.uniforms.threshold.value = smoothstep(0.75, 0, relativeFrame / 100);

  this.tunnelLayer.update(frame, frame - 2998);

};
