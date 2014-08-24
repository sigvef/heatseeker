function TunnelLayer() {
  this.scene = new THREE.Scene();
  var width = 16 * GU;
  var height = 9 * GU;
  this.camera = new THREE.OrthographicCamera(
      width / -2, width / 2, height / 2, height / -2, -1000, 1000);
  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
  this.scene.add(this.camera);

  this.currentMelodyNote = 0;

  this.melodyThrob = 0;

  this.zoom = 1;
  this.rotation = 0;
  this.x = 0;
  this.dx = 0;
  this.y = 0;

  this.canvas = document.createElement('canvas');
  this.canvas.width = 16 * GU;
  this.canvas.height = 9 * GU;
  this.ctx = this.canvas.getContext('2d');
  this.car = this.create2DObject('res/car.svg');

  this.treeScene = new Image();
  Loader.load('res/tree-scene.jpg', this.treeScene);

  this.plane = new THREE.Mesh(
    new THREE.PlaneGeometry(16 * GU, 9 * GU),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: new THREE.Texture(this.canvas)
    })
  );
  this.scene.add(this.plane);
  this.scene.add(new THREE.AmbientLight(0xffffff));
}

TunnelLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

TunnelLayer.prototype.resize = function() {
  this.canvas.width = 16 * GU;
  this.canvas.height = 9 * GU;
  this.car.svg.width = 117 * GU / 60;
  this.car.svg.height = 55 * GU / 60;
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

TunnelLayer.prototype.create2DObject = function(svgPath) {
  var obj = {};
  var svg = new Image();
  obj.width = 1;
  obj.height = 1;
  Loader.load(svgPath, svg, function() {
    obj.width = svg.width / GU;
    obj.height = svg.height / GU;
  });
  obj.svg = svg;
  obj.rotation = 0;
  obj.scale = new THREE.Vector2(1, 1);
  obj.x = 0;
  obj.y = 0;
  return obj;
}

TunnelLayer.prototype.drawObject = function(object) {
  if(!object.originalGU || object.originalGU == 1) {
    object.originalGU = GU;
    return;
  }
  this.ctx.save();
  var GUcorrection = GU / object.originalGU;
  var w = object.width * object.originalGU;
  var h = object.height * object.originalGU;
  this.ctx.translate(object.x * GU, object.y * GU);
  this.ctx.scale(object.scale.x * GUcorrection, object.scale.y * GUcorrection);
  this.ctx.rotate(object.rotation);
  this.ctx.drawImage(object.svg, -w / 2, -h / 2);
  this.ctx.restore();
}



TunnelLayer.prototype.update = function(frame, relativeFrame) {
  this.car.rotation = 0.53;
  this.car.scale.set(1.08 / 20, 1.25 / 20);
  this.x = smoothstep(-6, 10, (relativeFrame + 600) / 1200);
  this.x -= smoothstep(0, 2, (relativeFrame - 500) / 500);
  this.y = smoothstep(2, 2, (relativeFrame + 600) / 1200);
  this.y += smoothstep(0, 2.5, (relativeFrame - 500) / 500);
  this.zoom = smoothstep(20, 3, relativeFrame / 600);
  this.zoom *= smoothstep(1, 1/3, (relativeFrame - 500) / 500);

  this.car.x = this.x + 0.011;
  this.car.y = this.y + 0.015;

  this.car.rotation = smoothstep(0.53, -0.02, (relativeFrame) / 200);
  this.car.x += smoothstep(0, 8, (relativeFrame - 50) / 1000);
  this.car.x += smoothstep(0, 3, (relativeFrame - 100) / 450);

  if(frame > 3800) {
    this.car.x = lerp(16, -2, (frame - 3800) / 200);
    this.car.scale.set(-1.09 * 0.9, 1.25 * 0.9);
    this.car.rotation = smoothstep(0, -0.1, (frame - 3800) / 100);
    this.car.rotation -= smoothstep(-0, -0.1, (frame - 3900) / 100);
    this.car.y = smoothstep(7, 6, (frame - 3800) / 200);
  }

  if(this.musicThrob > 0) {
    this.musicThrob *= 0.95;
  }
  if(BEAT && BEAN % 6 == 0) {
    this.musicThrob = 1;
  }


  var ctx = this.ctx;
  if(!GU) { return; }
  ctx.fillStyle = '#ff00ff';
  ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  ctx.save();
  ctx.translate(8 * GU, 4.5 * GU);
  ctx.scale(this.zoom, this.zoom);
  ctx.rotate(this.rotation);
  //ctx.translate(-8 * GU, -4.5 * GU);
  ctx.translate(-this.x * GU, -this.y * GU);

  var x = 16 * GU;
  var y = 9 * GU;
  ctx.save();
  ctx.translate(x, y);
  var scale = 16 * GU / 1920 / 2;
  ctx.translate(-x, -y);
  ctx.scale(scale, scale);
  ctx.drawImage(this.treeScene, 0, 0);
  ctx.restore();

  if(this.melodyThrob > 0) {
    this.melodyThrob *= 0.8;
  }
  this.drawObject(this.car);
  ctx.restore();
  var melody = [
    0, 6, 9, 11, 15, 21,
    24, 29, 30, 31, 32, 33, 35, 38, 45, 47,
    48 + 0, 48 + 6, 48 + 9, 48 + 11, 48 + 15, 48 + 21,
    48 + 24, 48 + 27, 48 + 29, 48 + 30, 48 + 31,
      48 + 32, 48 + 33, 48 + 35, 48 + 38
  ];
  for(var i = 0; i < melody.length; i++) {
    var note = melody[i];
    if(BEAN % 48 == note) {
      this.currentMelodyNote = i;
      this.melodyThrob = 1;
      break;
    }
  }

  var panelX = smoothstep(-3, 0, (relativeFrame) / 50);
  panelX -= smoothstep(0, 3, (relativeFrame - 1025) / 50);
  ctx.save();
  ctx.translate(panelX * GU, 0);
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(0, 0, 3 * GU, 9 * GU);
  ctx.fillStyle = 'rgba(255, 0, 255, ' + this.melodyThrob + ')';
  ctx.fillRect(GU, GU, GU, GU);
  ctx.fillStyle = 'rgba(255, 0, 255, 1)';
  ctx.translate(1.5 * GU, 3.5 * GU);
  ctx.rotate(Math.PI / 2 * this.musicThrob * this.musicThrob * this.musicThrob);
  ctx.fillRect(- 0.5 * GU, - 0.5 * GU, GU, GU);
  ctx.restore();

  if(BEAN % 12 == 6 || BEAN % 12 == 8) {
    ctx.fillStyle = 'rgba(255, 0, 255, 1)';
    ctx.fillRect(GU, 5 * GU, GU, 1 / 4 * GU);
  }
  if(BEAN % 12 == 6 || BEAN % 12 == 7 || BEAN % 12 == 8) {
    ctx.fillStyle = 'rgba(255, 0, 255, 1)';
    ctx.fillRect(GU, 5.5 * GU, GU, 1 / 4 * GU);
    ctx.fillRect(GU, 6 * GU, GU, 1 / 4 * GU);
    ctx.fillRect(GU, 6.5 * GU, GU, 1 / 4 * GU);
  }
  ctx.fillRect(GU, 7 * GU, GU, GU);
  ctx.restore();


  var opac = smoothstep(0, 1, (frame - 5320) / 20);
  if(opac) {
    ctx.save();
    ctx.fillStyle = 'rgba(220, 100, 0, ' + opac + ')';
    ctx.fillRect(0, 0, 16 * GU, 9 * GU);
    ctx.restore();
  }

  this.plane.material.map.needsUpdate = true;
};
