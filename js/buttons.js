// 플레이 버튼
AFRAME.registerComponent('play', {
  init: function () {
    var playbtn = document.querySelector("#playbtn");
    var pausebtn = document.querySelector("#pausebtn");
    var visible = true

    playbtn.addEventListener("click", (e) => {

      if(visible) {
        visible = false;
        if (taskScheduler.isPlaying()) {
          taskScheduler.pause();
          playbtn.setAttribute('visible', "false");
          pausebtn.setAttribute('visible', "true");
        }
      }
      else {
        visible = true;
        if (!taskScheduler.isPlaying()){
          taskScheduler.resume();
          pausebtn.setAttribute('visible', "false");
          playbtn.setAttribute('visible', "true")
        };
      }
    });  
  }
});

// 되감기 버튼
AFRAME.registerComponent('rewind', {
  init: function () {
    var btn = document.querySelector("#rewindbtn");
    var playbtn = document.querySelector("#playbtn");
    var pausebtn = document.querySelector("#pausebtn");
    var prpPanel = document.querySelector('#prpsetInfo');
    var modelid = 0;

    btn.addEventListener("click", (e) => {
      playbtn.setAttribute('visible', 'true');
      pausebtn.setAttribute('visible', 'false');
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.1");
      setTimeout(function () {
        btn.setAttribute('depth', "0.2");
      }, 100);

      if (taskScheduler.isPlaying()) {
        taskScheduler.stop();
        taskScheduler.play();
        ifcLoader.ifcManager.removeSubset(modelid, mat);
        prpPanel.setAttribute('visible', 'false');
      }
      else {
        taskScheduler.stop();
        taskScheduler.play();
      }
    });
  }
});

// w 버튼
AFRAME.registerComponent("wcomponent", {
  init: function () {
    var player = document.querySelector("#a_world");
    var btn = document.querySelector("#wbtn");
    var cam = document.querySelector("#camera");

    btn.addEventListener("click", (e) => {
      var pos = player.getAttribute("position");
      var camDir = new Vector3(0, 0, 1);
      camDir.transformDirection(cam.object3D.matrixWorld);
      camDir.multiplyScalar(5);
      pos.add(camDir);
      player.setAttribute("position", pos);
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.1");
      setTimeout(function () {
        btn.setAttribute('depth', "0.2");
      }, 100);
    });
  }
});

// s 버튼
AFRAME.registerComponent("scomponent", {
  init: function () {
    var player = document.querySelector("#a_world");
    var btn = document.querySelector("#sbtn");
    var cam = document.querySelector("#camera");

    btn.addEventListener("click", (e) => {
      var pos = player.getAttribute("position");
      var camDir = new Vector3(0, 0, -1);
      camDir.transformDirection(cam.object3D.matrixWorld);
      camDir.multiplyScalar(5);
      pos.add(camDir);
      player.setAttribute("position", pos);
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.1");
      setTimeout(function () {
        btn.setAttribute('depth', "0.2");
      }, 100);
    });
  }
});

// a 버튼
AFRAME.registerComponent("acomponent", {
  init: function () {
    var player = document.querySelector("#a_world");
    var btn = document.querySelector("#abtn");
    var cam = document.querySelector("#camera");

    btn.addEventListener("click", (e) => {
      var pos = player.getAttribute("position");
      var camDir = new Vector3(1, 0, 0);
      camDir.transformDirection(cam.object3D.matrixWorld);
      camDir.multiplyScalar(5);
      pos.add(camDir);
      player.setAttribute("position", pos);
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.1");
      setTimeout(function () {
        btn.setAttribute('depth', "0.2");
      }, 100);
    });
  }
});

// d 버튼
AFRAME.registerComponent("dcomponent", {
  init: function () {
    var player = document.querySelector("#a_world");
    var btn = document.querySelector("#dbtn");
    var cam = document.querySelector("#camera");

    btn.addEventListener("click", (e) => {
      var pos = player.getAttribute("position");
      var camDir = new Vector3(-1, 0, 0);
      camDir.transformDirection(cam.object3D.matrixWorld);
      camDir.multiplyScalar(5);
      pos.add(camDir);
      player.setAttribute("position", pos);
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.1");
      setTimeout(function () {
        btn.setAttribute('depth', "0.2");
      }, 100);
    });
  }
});

var zbtn = -30;
var xbtn = -10;
var ybtn = -8;

// up 버튼
AFRAME.registerComponent("upcomponent", {
  init: function () {
    var player = document.querySelector("#a_world");
    var btn = document.querySelector("#upbtn");
    var cam = document.querySelector("#camera");

    btn.addEventListener("click", (e) => {
      var pos = player.getAttribute("position");
      var camDir = new Vector3(0, 1, 0);
      camDir.transformDirection(cam.object3D.matrixWorld);
      camDir.multiplyScalar(5);
      pos.add(camDir);

      ybtn += -2.8;
      pos = { x: pos.x, y: ybtn, z: pos.z }
      player.setAttribute("position", pos);
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.1");
      setTimeout(function () {
        btn.setAttribute('depth', "0.2");
      }, 100);
    });
  }
});

// down 버튼
AFRAME.registerComponent("dncomponent", {
  init: function () {
    var player = document.querySelector("#a_world");
    var btn = document.querySelector("#dnbtn");
    var cam = document.querySelector("#camera");

    btn.addEventListener("click", (e) => {
      var pos = player.getAttribute("position");
      var camDir = new Vector3(0, -1, 0);
      camDir.transformDirection(cam.object3D.matrixWorld);
      camDir.multiplyScalar(5);
      pos.add(camDir);

      ybtn += 2.8;
      pos = { x: pos.x, y: ybtn, z: pos.z }
      player.setAttribute("position", pos);
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.1");
      setTimeout(function () {
        btn.setAttribute('depth', "0.2");
      }, 100);
    });
  }
});

// 정보 on/off 버튼
AFRAME.registerComponent('show-info', {
  init: function () {
    var onbtn = document.querySelector("#onbtn");
    var offbtn = document.querySelector("#offbtn");
    var rewindbox = document.querySelector("#rewindbtn");
    var exitbtn = document.querySelector("#exitbtn");
    // var visibleimg = document.querySelector('#visibleimg');
    // var invisibleimg = document.querySelector('#invisibleimg');
    var playbtn = document.querySelector("#playbtn");
    var pausebtn = document.querySelector("#pausebtn");
    var wasdPanel = document.querySelector("#wasdPanel");
    var infoPanel = document.querySelector("#infoPanel");
    modelid = 0;

    var visible = true
    onbtn.addEventListener("click", (e) => {

      if (visible) {
        visible = false

        offbtn.setAttribute('visible', 'true');
        infoPanel.setAttribute('visible', "false");
        rewindbox.setAttribute('visible', "false");
        wasdPanel.setAttribute('visible', "false");
        playbtn.setAttribute('visible', "false");
        pausebtn.setAttribute('visible', "false");
        exitbtn.setAttribute('visible', "false");
        ifcLoader.ifcManager.removeSubset(modelid, mat);
      }
      else {
        visible = true

        onbtn.setAttribute('visible', 'true');
        offbtn.setAttribute('visible', 'false');
        infoPanel.setAttribute('visible', "true");
        playbtn.setAttribute('visible', "true");
        rewindbox.setAttribute('visible', "true");
        wasdPanel.setAttribute('visible', "true");
        exitbtn.setAttribute('visible', "true");
        ifcLoader.ifcManager.removeSubset(modelid, mat);
        if (taskScheduler.isPlaying()) {
          playbtn.setAttribute('visible', "true");
          pausebtn.setAttribute('visible', "false");
        }
        else {
          playbtn.setAttribute('visible', "false");
          pausebtn.setAttribute('visible', "true");
        }
      }
    });
  }
});

AFRAME.registerComponent('exit', {
  init: function () {
    var btn = document.querySelector("#exitbtn");
    const sceneEl = document.querySelector('a-scene');

    btn.addEventListener("click", (e) => {
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.1");
      setTimeout(function () {
        btn.setAttribute('depth', "0.2");
      }, 100);

      sceneEl.exitVRBound();
      // if (sceneEl.addEventListener('enter-vr', function (event) {
      //   btn.style.visibility = "visible";
      // }));
      // else if(sceneEl.addEventListener('exit-vr', function (event){
      //   btn.style.visibility = "hidden";
      // }));
    });
  }
});


