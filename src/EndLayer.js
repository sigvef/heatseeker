function EndLayer() {
  this.scene = new THREE.Scene();
  var width = 16 * GU;
  var height = 9 * GU;
  this.camera = new THREE.OrthographicCamera(
      width / -2, width / 2, height / 2, height / -2, -1000, 1000);
  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
  this.scene.add(this.camera);

  this.canvas = document.createElement('canvas');
  this.canvas.width = 16 * GU;
  this.canvas.height = 9 * GU;
  this.ctx = this.canvas.getContext('2d');

  this.credits = new Image();
  var that = this;
  Loader.load('res/youhavebeenwatching.png', this.credits, function() {
    var imgdcanvas = document.createElement('canvas');
    imgdcanvas.width = 64;
    imgdcanvas.height = 54;
    var cx = imgdcanvas.getContext('2d');
    cx.drawImage(that.credits, 0, 0);
    that.cdata = cx.getImageData(0, 0, 64, 54).data;
  });

  this.plane = new THREE.Mesh(
    new THREE.PlaneGeometry(16 * GU, 9 * GU),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: new THREE.Texture(this.canvas)
    })
  );
  this.plane.material.magFilter = THREE.NearestFilter;
  this.plane.material.minFilter = THREE.NearestFilter;

  this.scene.add(this.plane);
  this.scene.add(new THREE.AmbientLight(0xffffff));
}

EndLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

EndLayer.prototype.resize = function() {
  this.canvas.width = 16 * GU;
  this.canvas.height = 9 * GU;
  var width = 16 * GU;
  var height = 9 * GU;
  this.camera.left = width / -2;
  this.camera.right = width / 2;
  this.camera.top = height / 2;
  this.camera.bottom = height / -2;
  this.camera.near = -1000;
  this.camera.far = 1000;
  this.camera.updateProjectionMatrix();
  this.scene.remove(this.plane);
  this.plane = new THREE.Mesh(
    new THREE.PlaneGeometry(16 * GU, 9 * GU),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: new THREE.Texture(this.canvas)
    })
  );
  this.scene.add(this.plane);
};


EndLayer.prototype.update = function(frame, relativeFrame) {
  var XO = smoothstep(0, 4.5 * GU, (frame - 6990 - 50) / 50);
  var ctx = this.ctx;
  if(!GU) { return; }
  for(var i = 0; i < this.cdata.length; i+=4) {
    var x =  i % (64 * 4);
    var y =  (i / (64 * 4)) | 0;
    var r = this.cdata[i];
    var g = this.cdata[i + 1];
    var b = this.cdata[i + 2];
    ctx.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
    ctx.fillRect(x * GU / 4 / 4, -XO + y * GU / 4, GU / 4, GU / 4);
  }
  this.plane.material.map.needsUpdate = true;
};
