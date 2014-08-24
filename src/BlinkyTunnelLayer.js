function BlinkyTunnelLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.tunnel);
  this.musicThrob = 1;
  this.greetCanvas = document.createElement('canvas');
  this.greetCanvas.width = 32;
  this.greetCanvas.height = 18;
  this.greetCtx = this.greetCanvas.getContext('2d');
  this.shaderPass.uniforms.greets.value = new THREE.Texture(this.greetCanvas);
  this.shaderPass.uniforms.greets.value.magFilter = THREE.NearestFilter;
  this.shaderPass.uniforms.greets.value.minFilter = THREE.NearestFilter;

  this.namesCounter = 0;

  var _ = false;
  var $ = true;
  this.letters = {
    A: [
      [_, $, _],
      [$, _, $],
      [$, $, $],
      [$, _, $],
      [$, _, $],
    ],
    C: [
      [_, $, _],
      [$, _, $],
      [$, _, _],
      [$, _, $],
      [_, $, _],
    ],
    E: [
      [$, $, $],
      [$, _, _],
      [$, $, _],
      [$, _, _],
      [$, $, $],
    ],
    I: [
      [$, $, $],
      [_, $, _],
      [_, $, _],
      [_, $, _],
      [$, $, $],
    ],
    L: [
      [$, _, _],
      [$, _, _],
      [$, _, _],
      [$, _, _],
      [$, $, $],
    ],
    N: [
      [$, _, $],
      [$, $, $],
      [$, $, $],
      [$, $, $],
      [$, _, $],
    ],
    M: [
      [$, _, $],
      [$, $, $],
      [$, $, $],
      [$, _, $],
      [$, _, $],
    ],
    P: [
      [$, $, _],
      [$, _, $],
      [$, _, $],
      [$, $, _],
      [$, _, _],
    ],
    R: [
      [$, $, _],
      [$, _, $],
      [$, _, $],
      [$, $, _],
      [$, _, $],
    ],
    S: [
      [_, $, $],
      [$, _, _],
      [_, $, $],
      [_, _, $],
      [$, $, _],
    ],
    a: [
      [_, _, _],
      [$, $, _],
      [_, $, $],
      [$, _, $],
      [$, $, $],
    ],
    b: [
      [$, _, _],
      [$, $, _],
      [$, _, $],
      [$, _, $],
      [$, $, _],
    ],
    d: [
      [_, _, $],
      [_, $, $],
      [$, _, $],
      [$, _, $],
      [_, $, $],
    ],
    e: [
      [_, _, _],
      [_, $, $],
      [$, _, $],
      [$, $, _],
      [_, $, $],
    ],
    f: [
      [_, $],
      [$, _],
      [$, $],
      [$, _],
      [$, _],
    ],
    g: [
      [_, _, _],
      [_, $, $],
      [$, _, $],
      [$, $, $],
      [_, _, $],
      [_, $, _],
    ],
    i: [
      [$],
      [_],
      [$],
      [$],
      [$],
    ],
    j: [
      [_, _],
      [_, $],
      [_, _],
      [_, $],
      [_, $],
      [$, _],
    ],
    l: [
      [$],
      [$],
      [$],
      [$],
      [$],
    ],
    m: [
      [_, _, _],
      [$, $, $],
      [$, $, $],
      [$, $, $],
      [$, _, $],
    ],
    n: [
      [_, _, _],
      [$, $, _],
      [$, _, $],
      [$, _, $],
      [$, _, $],
    ],
    o: [
      [_, _, _],
      [_, $, _],
      [$, _, $],
      [$, _, $],
      [_, $, _],
    ],
    p: [
      [_, _, _],
      [$, $, _],
      [$, _, $],
      [$, _, $],
      [$, $, _],
      [$, _, _],
    ],
    r: [
      [_, _, _],
      [_, _, _],
      [_, $, $],
      [$, _, _],
      [$, _, _],
    ],
    s: [
      [_, _, _],
      [_, $, $],
      [$, $, _],
      [_, $, $],
      [$, $, _],
    ],
    t: [
      [_, _],
      [$, _],
      [$, $],
      [$, _],
      [$, $],
    ],
    u: [
      [_, _, _],
      [$, _, $],
      [$, _, $],
      [$, _, $],
      [_, $, $],
    ],
    v: [
      [_, _, _],
      [$, _, $],
      [$, _, $],
      [$, $, $],
      [_, $, _],
    ],
    y: [
      [_, _, _],
      [$, _, $],
      [$, _, $],
      [_, $, $],
      [_, _, $],
      [_, $, _],
    ],
    ø: [
      [_, _, _],
      [_, $, $],
      [$, _, $],
      [$, _, $],
      [$, $, _],
    ],
    '£': [
      [_, _],
      [$, _],
      [$, $],
      [$, $],
      [$, $],
    ],
    $: [
      [_, _],
      [_, $],
      [$, _],
      [_, $],
      [$, _],
    ],
  };
}


BlinkyTunnelLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

BlinkyTunnelLayer.prototype.update = function(frame, relativeFrame) {
  if(this.musicThrob > 0) {
    this.musicThrob *= 0.95;
  }
  if(BEAT && BEAN % 6 == 0) {
    this.musicThrob = 1;
  }
  this.shaderPass.uniforms.throb.value = this.musicThrob;
  this.shaderPass.uniforms.t.value = relativeFrame;
  this.shaderPass.uniforms.tunnelAmount.value = smoothstep(
      0, 1, (relativeFrame - 100) / 100);
  this.shaderPass.uniforms.opacity.value = smoothstep(
      0, 1, relativeFrame / 100);
  this.shaderPass.uniforms.opacity.value = smoothstep(
      0, 1, relativeFrame / 100);

  this.greetCtx.fillStyle = 'black';
  this.greetCtx.fillRect(0, 0, 32, 18);
  var names = [
    'Abellan',
    'Aimes',
    'C£pit£li$m',
    'Cristea',
    'Ilse',
    'Iverjo',
    'Liang',
    'Løve',
    'Mrdoob',
    'Ninjadev',
    'Poetene',
    'Profit',
    'Run',
    'Stiaje',
    'Mordi'];

  var y = (4 * relativeFrame / 18 | 0) % 18;
  var x = 0;
  var w = 32;
  var h = 1;
  this.greetCtx.save();
  this.greetCtx.globalCompositeOperation = 'lighter';
  if(BEAN >= 815) {
    y = 0;
    //x = (4 * relativeFrame / 32 | 0) % 32;
    x = (relativeFrame * 1.2) % 32;
    w = 1;
    h = 18;
  }
  if(BEAN % 48 >= 24 + 18) {
    this.greetCtx.translate(16, 9);
    this.greetCtx.rotate((BEAN - 24 - 18) / 5 * Math.PI);
  }
  this.greetCtx.fillStyle = 'rgba(255, 156, 0, 0.5)';
  this.greetCtx.fillRect(x, y, w, h);
  if(BEAN < 815) {
    this.greetCtx.fillRect(x, 15 - y, w, h);
  }
  this.greetCtx.restore();

  if(frame <= 4650) {
    this.namesCounter = -1;
  } else {
    if(BEAT && BEAN % 6 == 0) {
      this.namesCounter++;
    }
    if(this.namesCounter >= 0 && this.namesCounter < names.length) {
      var name = names[this.namesCounter];
      var x = (relativeFrame) % 32;
      this.drawText(name, x - 32);
      this.drawText(name, x);
    }
  }
  this.shaderPass.uniforms.greets.value.needsUpdate = true;
};

BlinkyTunnelLayer.prototype.drawText = function(text, offset) {
  this.greetCtx.save();
  this.greetCtx.fillStyle = '#00ff00';
  var w = 1;
  var h = w;
  offset *= w;
  for(var i = 0; i < text.length; i++) {
    var blocks = this.letters[text[i]];
    for(var y = 0; y < blocks.length; y++) {
      for(var x = 0; x < blocks[y].length; x++) {
        if(blocks[y][x]) {
          this.greetCtx.fillRect(
            offset + x * w,
            h + y * h,
            w, h);
        }
      }
    }
    offset += (blocks[0].length + 1) * w;
  }
  this.greetCtx.restore();
}
