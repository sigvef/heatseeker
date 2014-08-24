function VignetteLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.vignette); 
  this.shaderPass.uniforms.amount.value = 1.2;
}

VignetteLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

VignetteLayer.prototype.update = function(frame) {
  this.shaderPass.uniforms.amount.value = 1.5;

  if(frame > 2998) {
    this.shaderPass.uniforms.amount.value = smoothstep(1.5, 0, (frame - 2998 / 100));
  }
};
