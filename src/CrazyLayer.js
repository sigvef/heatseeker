function CrazyLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.crazy);
}

CrazyLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

CrazyLayer.prototype.update = function(frame, relativeFrame) {
  this.shaderPass.uniforms.t.value =  relativeFrame / 60;
};
