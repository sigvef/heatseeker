function BloomLayer() {
  this.shaderPass = new THREE.BloomPass(1.25, 25, 16, 2048);

  this.throb = 0;
}

BloomLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

BloomLayer.prototype.update = function(frame, relativeFrame) {
  this.shaderPass.copyUniforms.opacity.value = 0.9;

  if(this.throb > 0) {
    this.throb *= 0.98;
  }
  if(BEAT && BEAN % 6 == 0 && frame <= 6290) {
    this.throb = 1;
  }

  if(frame <= 3030) {
  this.shaderPass.copyUniforms.opacity.value = smoothstep(
      0.9, 0, (frame - 2950) / (3030 - 2950));
  } else if(frame <= 4109) {
  this.shaderPass.copyUniforms.opacity.value = smoothstep(
      0, 2, (frame - 4035) / (4109 - 4035));
  } else if(frame <= 5341) {
  this.shaderPass.copyUniforms.opacity.value = 2;
  } else if(frame <= 6290) {
    this.shaderPass.copyUniforms.opacity.value = 1.5 * this.throb;
  } else {
  this.shaderPass.copyUniforms.opacity.value = smoothstep(
      this.throb, 40, (frame - 6310) / (6320 - 6310));
  }
};
