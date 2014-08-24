function BlackoutLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.multiply);
  this.shaderPass.uniforms.r.value = 0;
  this.shaderPass.uniforms.g.value = 0;
  this.shaderPass.uniforms.b.value = 0;
}

BlackoutLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

BlackoutLayer.prototype.update = function(frame, relativeFrame) {
  function fadeOut(from, to) {
    return (frame - from) / (to - from);
  }
  function fadeIn(from, to) {
    return 1 - fadeOut(from, to);
  }
  var t = 0;
  if(relativeFrame <=  80) {
    t = 1;
  } else if(relativeFrame <= 350) {
    t = fadeIn(80, 350);
  } else if(relativeFrame <= 550) {
    t = fadeOut(350, 550);
  } else if(relativeFrame <= 650) {
    t = fadeIn(550, 650);
  } else if(relativeFrame <= 1100) {
    t = fadeOut(1050, 1100);
  } else if(relativeFrame <= 1100) {
    t = 1;
  } else if(relativeFrame <= 1140) {
    t = fadeIn(1100, 1140);
  }
  this.shaderPass.uniforms.amount.value = smoothstep(0, 1, t);
};
