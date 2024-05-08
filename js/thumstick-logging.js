
AFRAME.registerComponent('thumbstick-logging',{
  init: function () {    
    this.el.addEventListener('thumbstickmoved', this.logThumbstick);
  },
  logThumbstick: function (evt) {
    var cameraRig = document.querySelector('#cameraRig');
    
    if (evt.detail.y > 0.95) { // move forward
      // 숫자가 작아질수록 the action will be triggered with less thumstick movement. 더 예민해짐
      cameraRig.object3D.translateZ(0.05);
    }
    if (evt.detail.y < -0.95) { // move backward
      cameraRig.object3D.translateZ(-0.05);
    }
    if (evt.detail.x < -0.95) { // roate left
      cameraRig.object3D.rotateY(THREE.Math.degToRad(5));
    }
    if (evt.detail.x > 0.95) { // rotate right
      cameraRig.object3D.rotateY(THREE.Math.degToRad(-5));
    }
  }
});

AFRAME.registerComponent('thumbstick-logging',{
  init: function () {
    this.el.addEventListener('thumbstickmoved', this.logThumbstick);
  },
  logThumbstick: function (evt) {
    if (evt.detail.y > 0.95) { console.log("DOWN"); }
    if (evt.detail.y < -0.95) { console.log("UP"); }
    if (evt.detail.x < -0.95) { console.log("LEFT"); }
    if (evt.detail.x > 0.95) { console.log("RIGHT"); }
  }
});