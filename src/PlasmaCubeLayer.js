function PlasmaCubeLayer() {
  this.video = document.createElement('video');
  this.videoTexture = new THREE.Texture(this.video);
  this.videoTexture.generateMipMaps = false;
  this.shaderPass = new THREE.ShaderPass(SHADERS.plasmacube);
  this.shaderPass.uniforms.video.value = this.videoTexture;
  var that = this;
  Loader.load('res/wter.mp4', this.video, function(){
  });
}

PlasmaCubeLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

PlasmaCubeLayer.prototype.update = function(frame, relativeFrame) {
  if(relativeFrame == 0) {
    //this.video.currentTime = 0;
    //this.video.play();
  }
  this.video.currentTime = relativeFrame * 1 / 60;
  //this.video.play();
  //this.video.pause();
  console.log('frame:', frame, 'video time:', this.video.currentTime);
  this.shaderPass.uniforms.time.value = relativeFrame / 60;
  this.videoTexture.needsUpdate = true;
};
