function ConsoleLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.console);
}

ConsoleLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

ConsoleLayer.prototype.update = function(frame, relativeFrame) {
  this.shaderPass.uniforms.amount.value = smoothstep(
      1,
      0,
      (relativeFrame - 1750) / (1921 - 1750));

  this.shaderPass.uniforms.opacity.value = smoothstep(
      1,
      0,
      (relativeFrame - 2893) / (2968 - 2893));
};
