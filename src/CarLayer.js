function CarLayer(layer) {
  this.scene = new THREE.Scene();
  this.rotmod = new THREE.Vector3(0, 0, 0);
  this.rotmodspeed = new THREE.Vector3(0, 0, 0);
  this.rotmodaccel = new THREE.Vector3(0, 0, 0);
  this.posmod = new THREE.Vector3(0, 0, 0);
  this.posmodspeed = new THREE.Vector3(0, 0, 0);
  this.posmodaccel = new THREE.Vector3(0, 0, 0);
  this.cameraController = new CameraController(layer.position);
  this.camera = this.cameraController.camera;
  this.camera.near = 0.01;
  this.camera.updateProjectionMatrix();

  this.girlBody = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshLambertMaterial({color:0x222222}));
  this.girlBody.scale.set(0.8, 2, 0.8);
  this.scene.add(this.girlBody);

  this.dustRandom = new Random('dustTrail');
  this.cameraRandom = new Random('camera');
  this.buildingRandom = new Random('building');
  this.yorandom = new Random('it a hackathon deal with it');

  var text3d = new THREE.TextGeometry('Heatseeker', {
      size: 80,
      height: 20,
      curveSegments: 2,
      font: "helvetiker"
  });

    this.carMaterials = {
      CarPaint: new THREE.MeshPhongMaterial({
        transparent: true,
        map: Loader.loadTexture(
          'res/car/col_body_baked.png')
      }),
      only_shadow: new THREE.MeshPhongMaterial({
      }),
      license_plate: new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: Loader.loadTexture(
          'res/car/diff_license_plate.png'),
        normalMap: Loader.loadTexture(
          'res/car/nor_license_plate.png')
      }),
      blob_shadow: new THREE.MeshPhongMaterial({

      }),
      tire: new THREE.MeshPhongMaterial({
        map: Loader.loadTexture(
          'res/car/diff_tire_SMALL.png'),
        normalMap: Loader.loadTexture(
          'res/car/nor_tire_SMALL.png')
      }),
      rim: new THREE.MeshPhongMaterial({
        map: Loader.loadTexture(
          'res/car/diff_rim_SMALL_baked.png'),
        normalMap: Loader.loadTexture(
          'res/car/nor_rim_SMALL.png')
      }),
      body_mat: new THREE.MeshPhongMaterial({

      }),
      chrome: new THREE.MeshPhongMaterial({

      }),
      essence_cap: new THREE.MeshPhongMaterial({
        map: Loader.loadTexture(
          'res/car/diff_cap.png'),
        normalMap: Loader.loadTexture(
          'res/car/nor_cap.png')
      }),
      exhaust: new THREE.MeshPhongMaterial({
        map: Loader.loadTexture(
          'res/car/diff_exhaust.png')
      }),
      blinkers: new THREE.MeshPhongMaterial({
        map: Loader.loadTexture(
          'res/car/blinkers_SMALL.png')
      }),
      glass_mat: new THREE.MeshPhongMaterial({
        color: 0x000000,
        specular: 0xffffff,
        shading: THREE.SmoothShading,
        transparent: true,
        opacity: 0.9,
        shininess: 50
      }),
      chassis: new THREE.MeshPhongMaterial({
        map: Loader.loadTexture(
          'res/car/diff_chassis.png'),

      }),
      brake_disk: new THREE.MeshPhongMaterial({
        map: Loader.loadTexture(
          'res/car/diff_brake_disk_SMALL.png'),
        lightMap: Loader.loadTexture(
          'res/car/ao_brake_disk.png'),
        normalMap: Loader.loadTexture(
          'res/car/nor_brake_disk_SMALL.png'),
        specularMap: Loader.loadTexture(
          'res/car/spec_brake_disk_SMALL.png')
      }),
      rear_light: new THREE.MeshPhongMaterial({
        map: Loader.loadTexture(
          'res/car/diff_rearlight.png'),
        normalMap: Loader.loadTexture(
          'res/car/wire_rearlight.png'),
        emissive: 0xff8888
      }),
      logo1: new THREE.MeshPhongMaterial({
      }),
      interior: new THREE.MeshPhongMaterial({
        map: Loader.loadTexture(
          'res/car/diff_interior.png')
      }),
      roller: new THREE.MeshPhongMaterial({
        map: Loader.loadTexture(
          'res/car/diff_roller.png'),
        normalMap: Loader.loadTexture(
          'res/car/nor_roller.png'),
        emissive: 0xffffff
      }),
      chrome_roller: new THREE.MeshPhongMaterial({
      }),
      logo2: new THREE.MeshPhongMaterial({
      }),
      logo3: new THREE.MeshPhongMaterial({
        transparency: true,
      })
    };

    this.headMaterials = {
      eyeL_hi: new THREE.MeshPhongMaterial({
        map: Loader.loadTexture(
          'res/girlhead/ModelFace2_eyeL_hi.jpg')
      }),
      eyeR_hi: new THREE.MeshPhongMaterial({
        map: Loader.loadTexture(
          'res/girlhead/ModelFace2_eyeR_hi.jpg')
      }),
      sock: new THREE.MeshPhongMaterial({
        map: Loader.loadTexture(
          'res/girlhead/ModelFace2_sock.jpg')
      }),
      teethLower: new THREE.MeshPhongMaterial({
        map: Loader.loadTexture(
          'res/girlhead/ModelFace2_teethLower.jpg')
      }),
      teethUpper: new THREE.MeshPhongMaterial({
        map: Loader.loadTexture(
          'res/girlhead/ModelFace2_teethUpper.jpg')
      }),
      skin_hi: new THREE.MeshPhongMaterial({
        map: Loader.loadTexture(
          'res/girlhead/ModelFace2_skin_hi.jpg'),
        normalMap: Loader.loadTexture(
          'res/girlhead/nor_ModelFace2_skin_hi.jpg')
      }),
      tongue: new THREE.MeshPhongMaterial({
        map: Loader.loadTexture(
          'res/girlhead/ModelFace2_tongue.jpg')
      }),
    }

  this.title = new THREE.Mesh(text3d,
    new THREE.MeshPhongMaterial({
      color: 0xffbd0b,
      metal: true,
      emissive: 0x444444
    }));
  this.scene.add(this.title);
  var scale = 0.2;
  this.title.scale.set(scale, scale, scale);
  this.title.rotation.z = Math.PI / 2;
  this.title.rotation.y = 0.4;
  this.title.position.set(-70, 20, -1587);

  this.beatColorIntensity = 0;

  this.scene.fog = new THREE.FogExp2( 0x5fa5d8, 0.0025 );
  this.scene.fog.color = new THREE.Color(0x000000);

  this.signPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 13.535),
      new THREE.MeshPhongMaterial({
        color: 0xdddddd,
        shininess: 100,
        metal: true
      }));

  var dustTrailGeometry = new THREE.Geometry();
  this.dustTrailParticleAttrs = [];
  for(var i = 0; i < 30000; i++) {
    var particle = new THREE.Vector3(0, 0, 0);
    this.dustTrailParticleAttrs.push({life: this.dustRandom() * 10, x:0,y:0,z:0, dx:0,dy:0,dz:0});
    dustTrailGeometry.vertices.push(particle);
  }
  var dustTrailMaterial = new THREE.PointCloudMaterial({
    color: 0x888888,
    size: 0.2,
    map: Loader.loadTexture('res/snowflake.png'),
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
  });
  this.dustTrail = new THREE.PointCloud(dustTrailGeometry, dustTrailMaterial);
  this.scene.add(this.dustTrail);


  this.signPole.position.set(8.83, 0, -2990.42);
  this.scene.add(this.signPole);

  var signMap = Loader.loadTexture('res/sign.png');
  var signMaterial = new THREE.MeshLambertMaterial({
    map: signMap,
    color: 0xffffff,
    transparent: true
  });
  var sign = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 0.1),
      signMaterial);
  this.sign = sign;
  sign.position.set(
    this.signPole.position.x,
    8.025,
    this.signPole.position.z
  );
  this.scene.add(sign);
  var scale = 800 / 319;
  sign.scale.set(scale, scale, scale);

  this.dirLight = new THREE.DirectionalLight(0xffffff, 0);
  this.dirLight.castShadow = true;
  this.dirLight.shadowMapWidth = 1024;
  this.dirLight.shadowMapHeight = 1024;
  this.dirLight.shadowCameraNear = 0.1;
  this.dirLight.shadowCameraFar = 2;
  this.dirLight.shadowCameraFov = 160;
  this.dirLight.angle = Math.PI / 2;
  this.dirLight.position.set(1, 1, 1);
  this.scene.add(this.dirLight);

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);

  this.cube = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.01),
                             new THREE.MeshLambertMaterial({
    color: 0x00ff00
  }));

  var buildingGeometry = new THREE.BoxGeometry(1, 1, 1);
  buildingGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
  for(var i = 0; i < 3; i++) {
    buildingGeometry.faceVertexUvs[0][2][i].set(0, 0);
  }
  var buildingMesh = new THREE.Mesh(buildingGeometry);
  var light = new THREE.Color(0xffffff);
  var shadow = new THREE.Color(0x505060);
  var cityGeometry = new THREE.Geometry();
  for(var i = 0; i < 500; i++) {
    buildingMesh.position.x = this.buildingRandom() > 0.5 ? -80 : 80;
    buildingMesh.position.z = -i * 20 + this.buildingRandom() * 10;
    buildingMesh.rotation.y = this.buildingRandom() * Math.PI * 2;
    buildingMesh.scale.x = this.buildingRandom() * this.buildingRandom() * this.buildingRandom() * 20 + 20;
    buildingMesh.scale.y = buildingMesh.scale.x * (this.buildingRandom() + 5);
    buildingMesh.scale.z = buildingMesh.scale.x;
    var value = 1 - this.buildingRandom() * this.buildingRandom() * this.buildingRandom() + 0.5;
    var baseColor = new THREE.Color().setRGB(value + this.buildingRandom() * this.buildingRandom() * 0.05, value, value);
    var topColor = baseColor.clone().multiply(light);
    var bottomColor = baseColor.clone().multiply(shadow);
    var geometry = buildingMesh.geometry;
    var id = new THREE.Color(0xff00ff);
    for(var j = 0, jl = geometry.faces.length; j < jl; j++) {
      geometry.faces[j].vertexColors = [baseColor, baseColor, baseColor];
      if(j == 0) {
        geometry.faces[j].vertexColors = [topColor, bottomColor, topColor];
      } else if(j == 1) {
        geometry.faces[j].vertexColors = [bottomColor, bottomColor, topColor];
      } else if(j == 2) {
        geometry.faces[j].vertexColors = [topColor, bottomColor, topColor];
      } else if(j == 3) {
        geometry.faces[j].vertexColors = [bottomColor, bottomColor, topColor];
      } else if(j == 4) {
        geometry.faces[j].vertexColors = [topColor, bottomColor, topColor];
      } else if(j == 5) {
        geometry.faces[j].vertexColors = [topColor, topColor, topColor];
      } else if(j == 6) {
        geometry.faces[j].vertexColors = [topColor, topColor, topColor];
      }
    }
    THREE.GeometryUtils.merge(cityGeometry, buildingMesh);
  }
  var texture = Loader.loadTexture('res/building.jpg');
  var material = new THREE.MeshLambertMaterial({
    map: texture,
    vertexColors: THREE.VertexColors
  });
  material.map.wrapS = THREE.RepeatWrapping;
  material.map.wrapT = THREE.RepeatWrapping;
  material.map.repeat.set(4, 12);
  this.cityMesh = new THREE.Mesh(cityGeometry, material);
  this.scene.add(this.cityMesh);


  this.carLightsIntensity = 0;

  this.plane = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 1000 * 5),
    new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 0,
      map: Loader.loadTexture('res/snowroad.jpg'),
      normalMap: Loader.loadTexture('res/nor_snowroad.jpg')
    }));

  this.tracksPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 1000 * 5),
    new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 0,
      map: Loader.loadTexture('res/snowroad_tracks.jpg'),
      normalMap: Loader.loadTexture('res/nor_snowroad_tracks.jpg')
    }));

  this.ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 10000),
      new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 0,
        map: Loader.loadTexture('res/snow.jpg'),
        normalMap: Loader.loadTexture('res/nor_snow.jpg')
        
      }));

  this.ground.position.y = -1;
  this.ground.rotation.x = -Math.PI / 2;
  this.ground.material.map.wrapS = THREE.RepeatWrapping;
  this.ground.material.map.wrapT = THREE.RepeatWrapping;
  this.ground.material.map.repeat.set(10, 100);
  /*
  this.ground.material.normalMap.wrapS = THREE.RepeatWrapping;
  this.ground.material.normalMap.wrapT = THREE.RepeatWrapping;
  this.ground.material.normalMap.repeat.set(10, 100);
  */

  this.scene.add(this.ground);

  this.plane.position.x = -10;
  this.plane.position.z = -2505;

  this.plane.receiveShadow = true;
  this.plane.material.map.wrapS = THREE.RepeatWrapping;
  this.plane.material.map.wrapT = THREE.RepeatWrapping;
  this.plane.material.map.repeat.set(1, 10 * 5);
  this.plane.rotation.x = -Math.PI / 2;
  this.scene.add(this.plane);
  this.plane.material.normalMap.wrapS = THREE.RepeatWrapping;
  this.plane.material.normalMap.wrapT = THREE.RepeatWrapping;
  this.plane.material.normalMap.repeat.set(1, 10 * 5);

  this.tracksPlane.position.x = -10;
  this.tracksPlane.position.z = 2495;

  this.tracksPlane.receiveShadow = true;
  this.tracksPlane.material.map.wrapS = THREE.RepeatWrapping;
  this.tracksPlane.material.map.wrapT = THREE.RepeatWrapping;
  this.tracksPlane.material.map.repeat.set(1, 10 * 5);
  this.tracksPlane.rotation.x = -Math.PI / 2;
  this.scene.add(this.tracksPlane);
  this.tracksPlane.material.normalMap.wrapS = THREE.RepeatWrapping;
  this.tracksPlane.material.normalMap.wrapT = THREE.RepeatWrapping;
  this.tracksPlane.material.normalMap.repeat.set(1, 10 * 5);

  var that = this;
  var loader = new THREE.ObjectLoader();
  Loader.loadAjax('res/helmet/helmet.json', function(data) {
    var scene = loader.parse(JSON.parse(data));
    var helmet = new THREE.Object3D();
    that.helmet = helmet;
    var scale = 0.00018;
    helmet.scale.set(scale, scale, scale);
    helmet.rotation.y = Math.PI;
    helmet.rotation.x = -0.24;

    var surfaceMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff
    });
    var detailMaterial = new THREE.MeshPhongMaterial({
      color: 0x222222,
      metal: true,
      shininess: 100
    });
    var visorMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0xffffff,
      shininess: 10
    });

    var visor = new THREE.Object3D();
    that.visor = visor;
    var innerVisor = new THREE.Object3D();
    visor.position.y = 1390;
    innerVisor.position.x = 0;
    innerVisor.position.y = -1390;
    innerVisor.position.z = 0;
    visor.add(innerVisor);
    helmet.add(visor);
    while(scene.children.length) {
      var child = scene.children[0];
      var id = scene.children.length - 1;

      if(id == 8 || id == 18 || id == 17) {
        innerVisor.add(child);
      }else {
        helmet.add(child);
      }

      if(id == 29 || id == 28 || id == 23 || id == 21 ||
         id == 20 || id == 18 || id == 11 || id == 6) {
        child.material = surfaceMaterial;
      } else if (id == 8) {
        child.material = visorMaterial;
      } else {
        child.material = detailMaterial;
      }
    }
    that.scene.add(helmet);
  });

  Loader.loadAjax('res/girlhead/girl-head.json', function(data) {
    var scene = loader.parse(JSON.parse(data));
    var head = new THREE.Object3D();
    var scale = 0.0032;
    head.scale.set(scale, scale, scale);
    that.head = head;
    that.head.rotation.y = Math.PI;
    that.head.rotation.x = -0.24;
    that.scene.add(that.head);
    while(scene.children.length) {
      var child = scene.children[0];
      head.add(child);
      console.log(child.name);
      child.receiveShadow = true;
      if(child.name in that.headMaterials) {
        child.material = that.headMaterials[child.name];
      }
    }
  });

  Loader.loadAjax('res/car/car.json', function(data) {
    var scene = loader.parse(JSON.parse(data));
    var car = new THREE.Object3D();
    that.car = car;
    that.car.castShadow = true;

    that.insideCarLight.castShadow = true;
    that.insideCarLight.shadowMapWidth = 1024;
    that.insideCarLight.shadowMapHeight = 1024;
    that.insideCarLight.shadowCameraNear = 0.1;
    that.insideCarLight.shadowCameraFar = 2;
    that.insideCarLight.shadowCameraFov = 160;
    that.insideCarLight.angle = Math.PI / 2;

    that.carLights1.castShadow = true;
    that.carLights1.shadowMapWidth = 1024;
    that.carLights1.shadowMapHeight = 1024;
    that.carLights1.shadowCameraNear = 1;
    that.carLights1.shadowCameraFar = 200;
    that.carLights1.shadowCameraFov = 30;

    that.carLights2.castShadow = true;
    that.carLights2.shadowMapWidth = 1024;
    that.carLights2.shadowMapHeight = 1024;
    that.carLights2.shadowCameraNear = 1;
    that.carLights2.shadowCameraFar = 200;
    that.carLights2.shadowCameraFov = 30;

    that.wheel0 = new THREE.Object3D();
    that.wheel0center = new THREE.Object3D();
    that.wheel1 = new THREE.Object3D();
    that.wheel1center = new THREE.Object3D();
    that.wheel2 = new THREE.Object3D();
    that.wheel2center = new THREE.Object3D();
    that.wheel3 = new THREE.Object3D();
    that.wheel3center = new THREE.Object3D();
    while(scene.children.length > 2) {
      var child = scene.children[0];
      child.castShadow = true;

      if(child.material.name in that.carMaterials) {
        child.material = that.carMaterials[child.material.name];
      } else {
        child.material = new THREE.MeshLambertMaterial();
      }

      if(child.name.indexOf('Wheel0') != -1) {
        that.wheel0center.add(child); 
        child.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(
              -0.1, -1.594, 0.333));
        child.geometry.verticesNeedsUpdate = true;
      } else if(child.name.indexOf('Wheel1') != -1) {
        that.wheel1center.add(child); 
        child.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(
              0.1, -1.594, 0.333));
        child.geometry.verticesNeedsUpdate = true;
      } else if(child.name.indexOf('Wheel2') != -1) {
        that.wheel2center.add(child); 
        child.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(
              0.1, 1.47, 0.333));
        child.geometry.verticesNeedsUpdate = true;
      } else if(child.name.indexOf('Wheel3') != -1) {
        that.wheel3center.add(child); 
        child.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(
              0.1, 1.47, 0.333));
        child.geometry.verticesNeedsUpdate = true;
      } else {
        car.add(child);
      }
    }
    that.wheel0.position.set(0.1, 1.594, -0.333);
    that.wheel0.add(that.wheel0center);
    that.wheel1.position.set(-0.1, 1.594, -0.333);
    that.wheel1.add(that.wheel1center);
    that.wheel2.position.set(-0.1, -1.47, -0.333);
    that.wheel2.add(that.wheel2center);
    that.wheel3.position.set(-0.1, -1.47, -0.333);
    that.wheel3.add(that.wheel3center);
    car.add(that.wheel0);
    car.add(that.wheel1);
    car.add(that.wheel2);
    car.add(that.wheel3);

    car.rotation.x = -Math.PI / 2;
    car.position.y = 2.084;
    car.scale.set(3, 3, 3);
    that.scene.add(car);
  });


  this.cameraLight = new THREE.SpotLight(0xffffff, 0.5, 0, Math.PI / 2);
  this.cameraLight.castShadow = true;
  this.cameraLight.shadowMapWidth = 1024;
  this.cameraLight.shadowMapHeight = 1024;
  this.cameraLight.shadowCameraNear = 1;
  this.cameraLight.shadowCameraFar = 200;
  this.cameraLight.shadowCameraFov = 30;
  this.scene.add(this.cameraLight);

  this.insideCarLight = new THREE.SpotLight(0xffddaa, 0.9);
  this.insideCarLight.distance = 2;
  this.insideCarLight.exponent = 2;
  //this.scene.add(this.insideCarLight);
  this.carLights1 = new THREE.SpotLight(0xffffff, 1.0, 0, Math.PI / 5, 10.0);
  this.carLights2 = new THREE.SpotLight(0xffffff, 1.0, 0, Math.PI / 5, 10.0);
  this.scene.add(this.carLights1);
  this.scene.add(this.carLights2);
}

CarLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
}

CarLayer.prototype.update = function(frame, relativeFrame) {

  this.cameraController.updateCamera(relativeFrame);
  if(relativeFrame == 731 ||
     relativeFrame == 766 ||
     relativeFrame == 796 ||
     relativeFrame == 930 ||
     relativeFrame == 1139 ||
     relativeFrame == 1477 ||
     relativeFrame == 1614
     ) {
    this.rotmod.x = (this.cameraRandom() - 0.5) * 0.2;
    this.rotmod.y = (this.cameraRandom() - 0.5) * 0.2;
    this.rotmod.z = (this.cameraRandom() - 0.5) * 0.2;
  }
  this.rotmodspeed.x = -this.rotmod.x / 8;
  this.rotmodspeed.y = -this.rotmod.y / 8;
  this.rotmodspeed.z = -this.rotmod.z / 8;
  this.rotmodaccel.x += this.cameraRandom() * 0.0005;
  this.rotmodaccel.y += this.cameraRandom() * 0.0005;
  this.rotmodaccel.z += this.cameraRandom() * 0.0005;
  this.rotmodaccel.x *= 0.9;
  this.rotmodaccel.y *= 0.9;
  this.rotmodaccel.z *= 0.9;
  this.rotmodspeed.x += this.rotmodaccel.x;
  this.rotmodspeed.y += this.rotmodaccel.y;
  this.rotmodspeed.z += this.rotmodaccel.z;
  this.rotmod.x += this.rotmodspeed.x;
  this.rotmod.y += this.rotmodspeed.y;
  this.rotmod.z += this.rotmodspeed.z;
  this.camera.rotation.x += this.rotmod.x;
  this.camera.rotation.y += this.rotmod.y;
  this.camera.rotation.z += this.rotmod.z;

  this.posmodspeed.x = -this.posmod.x / 8;
  this.posmodspeed.y = -this.posmod.y / 8;
  this.posmodspeed.z = -this.posmod.z / 8;
  this.posmodaccel.x += this.cameraRandom() * 0.0005;
  this.posmodaccel.y += this.cameraRandom() * 0.0005;
  this.posmodaccel.z += this.cameraRandom() * 0.0005;
  this.posmodaccel.x *= 0.9;
  this.posmodaccel.y *= 0.9;
  this.posmodaccel.z *= 0.9;
  this.posmodspeed.x += this.posmodaccel.x;
  this.posmodspeed.y += this.posmodaccel.y;
  this.posmodspeed.z += this.posmodaccel.z;
  this.posmod.x += this.posmodspeed.x;
  this.posmod.y += this.posmodspeed.y;
  this.posmod.z += this.posmodspeed.z;

  if(relativeFrame >= 2800) {
    var dampening = smoothstep(1., 0, (relativeFrame - 2800) / (2997 - 2800));
    this.camera.rotation.x *= dampening;
    this.camera.rotation.y *= dampening;
    this.camera.rotation.z *= dampening;
  }

  this.camera.fov = smoothstep(
      35,
      75,
      (relativeFrame - 1800) / (1921 - 1800));
  this.camera.updateProjectionMatrix();

  this.camera.position.z -= smoothstep(0, 5, (relativeFrame - 1800) / (1921 - 1800));

  this.dirLight.intensity = smoothstep(0, 0.2, (relativeFrame - 1800) / (1921 - 1800));

  var speed = 0;


  if(relativeFrame < 1368) {
    if(relativeFrame == 1335 || relativeFrame == 1346 || relativeFrame == 1357) {
      this.carLightsIntensity = 1;
    }

    this.carLightsIntensity *= 0.9;
  } else if(relativeFrame >= 1368) {
    this.carLightsIntensity = 1;
    speed = -smoothstep(0, 1000, (relativeFrame - 1368) / (3000));
  }

  speed = speed - (relativeFrame - 1800) / 2 * smoothstep(0, 5, (relativeFrame - 1800) / (1921 - 1800));

  if(this.carMaterials) {
  this.carMaterials.rear_light.emissive.setRGB(
    0xff / 0xff * this.carLightsIntensity,
    0x88 / 0xff * this.carLightsIntensity,
    0x88 / 0xff * this.carLightsIntensity
  );
  this.carMaterials.roller.emissive.setRGB(
    0xff / 0xff * this.carLightsIntensity,
    0xff / 0xff * this.carLightsIntensity,
    0xff / 0xff * this.carLightsIntensity
  );
  }
  this.carLights1.intensity = this.carLightsIntensity;
  this.carLights2.intensity = this.carLightsIntensity;

  if(this.car) {
    this.car.position.z = speed;

    if(this.head) {
      this.head.position.set(
        this.car.position.x - 1.24,
        this.car.position.y + 1.15,
        this.car.position.z - 0.2
      );
      this.girlBody.position.set(
        this.head.position.x,
        this.head.position.y - 2.4,
        this.head.position.z + 0.3
      );
    }

    if(this.helmet) {
      this.helmet.position.set(
        this.car.position.x - 1.32,
        this.car.position.y + 1.05,
        this.car.position.z - 0.09
      );

      this.visor.rotation.x = -smoothstep(0.78, 0, (relativeFrame - 1020) / (1060 - 1020));
    }
  }

  if(this.carMaterials) {
    if(relativeFrame < 1100) {
      this.carMaterials.glass_mat.opacity = smoothstep(0.9, 0, (relativeFrame - 900) / (1000 - 900));
    } else {
      this.carMaterials.glass_mat.opacity = 0.9;
    }
  }

  if(this.cameraController && this.cameraController.lookAt) {
    this.cameraLight.position.set(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z
    );
    var lookAt = this.cameraController.get3Dpoint(
        this.cameraController.lookAt, relativeFrame);
    this.cameraLight.target.position.set(
      lookAt.x,
      lookAt.y,
      lookAt.z
    );
  }

  this.camera.position.z += speed;


  var oldcamx = this.camera.position.x;
  var oldcamy = this.camera.position.y;
  var oldcamz = this.camera.position.z;


  /*
  if(relativeFrame >= 1916) {
    var mix = (relativeFrame - 1916) / 350;
    this.camera.position.set(
        smoothstep(
          oldcamx,
          this.car.position.x - 12 * Math.sin(relativeFrame * 0.01),
          mix),
        smoothstep(oldcamy, 5, mix),
        smoothstep(
          oldcamz,
          this.car.position.z - 12 * Math.cos(relativeFrame * 0.01),
          mix)
        );
    this.camera.lookAt(this.car.position);
  }

  if(relativeFrame >= 1916 + 350) {
    var mix = (relativeFrame - (1916 + 350)) / 350;
    this.camera.position.set(
        smoothstep(
          this.car.position.x - 12 * Math.sin(relativeFrame * 0.005),
          oldcamx,
          mix),
        smoothstep(
          this.camera.position.y,
          oldcamy,
          mix
        ),
        smoothstep(
          this.car.position.z + 12 * Math.cos(relativeFrame * 0.005),
          oldcamz,
          mix)
        );
    this.camera.lookAt(this.car.position);
  }
  */

  /*
  if(relativeFrame > 2450 && relativeFrame < 2900) {
    if(BEAT && BEAN % 6 == 0) {
      this.posmod.x += 16 * (this.yorandom() - 0.5) * (this.yorandom() - 0.5);
      this.posmod.y += 16 * (this.yorandom() - 0.5) * (this.yorandom() - 0.5);
      this.posmod.z += 16 * (this.yorandom() - 0.5) * (this.yorandom() - 0.5);
    }
  }
  */

  if(relativeFrame > 2700) {
    this.camera.position.z += (relativeFrame - 2700) * smoothstep(
        0, 1.75, (relativeFrame - 2700) / (2998 - 2700));

  }

  if(relativeFrame > 2800) {
    this.camera.fov = smoothstep(75, 15, (relativeFrame - 2800) / (2980 - 2800));
    this.camera.updateProjectionMatrix();
  }

  /*
  -0.22166679511547754, _y: 0.32837942323386776, _z: 0.08925312720418371
  */


  if(relativeFrame >= 2903) {
    this.camera.position.set(8.83,8.03,-2975.28);
    //this.camera.lookAt(new THREE.Vector3(8.83,8.03,-3171.48));
  }


  if(this.car) {

  this.plane.position.z = this.car.position.z - 2505;
  this.tracksPlane.position.z = this.car.position.z + 2495;
  this.plane.material.map.offset.y = -this.car.position.z / 50;
  this.tracksPlane.material.map.offset.y = -this.car.position.z / 50;

    this.insideCarLight.position.set(
      this.car.position.x - 0.7,
      this.car.position.y + 1.6,
      this.car.position.z - 1.5
    );
    this.insideCarLight.target.position.set(
      this.car.position.x - 1.1,
      this.car.position.y + 1.0,
      this.car.position.z
    );

    this.carLights1.position.set(
      this.car.position.x - 2.2,
      this.car.position.y,
      this.car.position.z - 7
    );
    this.carLights1.target.position.set(
      this.car.position.x - 2.2,
      this.car.position.y - .8,
      this.car.position.z - 11
    );
    this.carLights2.position.set(
      this.car.position.x + 2.2,
      this.car.position.y,
      this.car.position.z - 7
    );
    this.carLights2.target.position.set(
      this.car.position.x + 2.2,
      this.car.position.y - .8,
      this.car.position.z - 11
    );


    this.dustTrail.position.z = this.car.position.z;
    this.dustTrail.position.x = this.car.position.x;
    for(var i = 0; i < this.dustTrail.geometry.vertices.length; i++) {
      var particle = this.dustTrail.geometry.vertices[i];
      var attrs = this.dustTrailParticleAttrs[i];
      attrs.life -= 0.1;
      if(attrs.life < 0) {
        attrs.life = 5 + this.dustRandom() * 5;
        attrs.x = this.dustTrail.position.x + (this.dustRandom() - 0.5) * 200;
        attrs.y = this.dustTrail.position.y + (this.dustRandom() - 0.5) * 200;
        attrs.z = this.dustTrail.position.z + (this.dustRandom() - 0.9) * 200;
        attrs.dx = (this.dustRandom() - 0.5) * 0.01;
        attrs.dy = 0.1;
        attrs.dz = (this.dustRandom() - 0.5) * 0.01;
      }
      attrs.x -= attrs.dx;
      attrs.y -= attrs.dy;
      attrs.z -= attrs.dz;
      particle.x = attrs.x;
      particle.y = attrs.y;
      particle.z = attrs.z - this.dustTrail.position.z;
      particle.z = attrs.z - this.car.position.z;
    }
    this.dustTrail.geometry.verticesNeedUpdate = true;

  }


  if(BEAN >= 334) {
    if(BEAT && BEAN % 6 == 0) {
      this.beatColorIntensity = 1;
    }
    if(this.beatColorIntensity > 0) {
      this.beatColorIntensity -= 0.03;
    }
    var col = this.beatColorIntensity * 0.2 + 0.8;
    for(var i = 0; i < this.cityMesh.geometry.faces.length; i++) {
      var face = this.cityMesh.geometry.faces[i];
      face.vertexColors[0].setRGB(col, col * col, col * col * col);
      face.vertexColors[1].setRGB(col, col * col, col * col * col);
      face.vertexColors[2].setRGB(col, col * col, col * col * col);
    }
    this.cityMesh.geometry.colorsNeedUpdate = true;

    this.dirLight.intensity = this.beatColorIntensity * 0.1 + 0.2;
  }

  var wheelRotation = speed;
  if(this.wheel0) {
    this.wheel0.rotation.x = wheelRotation;
  }
  if(this.wheel1) {
    this.wheel1.rotation.x = wheelRotation;
  }
  if(this.wheel2) {
    this.wheel2.rotation.x = wheelRotation;
  }
  if(this.wheel3) {
    this.wheel3.rotation.x = wheelRotation;
  }

  this.camera.position.x += this.posmod.x;
  this.camera.position.y += this.posmod.y;
  this.camera.position.z += this.posmod.z;

};
