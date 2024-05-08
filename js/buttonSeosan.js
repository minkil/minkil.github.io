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
      btn.setAttribute('depth', "0.2");
      setTimeout(function () {
        btn.setAttribute('depth', "0.4");
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
      camDir.multiplyScalar(2);
      pos.add(camDir);
      player.setAttribute("position", pos);
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.2");
      setTimeout(function () {
        btn.setAttribute('depth', "0.4");
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
      camDir.multiplyScalar(2);
      pos.add(camDir);
      player.setAttribute("position", pos);
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.2");
      setTimeout(function () {
        btn.setAttribute('depth', "0.4");
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
      camDir.multiplyScalar(2);
      pos.add(camDir);
      player.setAttribute("position", pos);
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.2");
      setTimeout(function () {
        btn.setAttribute('depth', "0.4");
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
      camDir.multiplyScalar(2);
      pos.add(camDir);
      player.setAttribute("position", pos);
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.2");
      setTimeout(function () {
        btn.setAttribute('depth', "0.4");
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
      camDir.multiplyScalar(2);
      pos.add(camDir);

      ybtn += -2.8;
      pos = { x: pos.x, y: ybtn, z: pos.z }
      player.setAttribute("position", pos);
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.2");
      setTimeout(function () {
        btn.setAttribute('depth', "0.4");
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
      camDir.multiplyScalar(2);
      pos.add(camDir);

      ybtn += 2.8;
      pos = { x: pos.x, y: ybtn, z: pos.z }
      player.setAttribute("position", pos);
      // 버튼이 눌려보이는 효과
      btn.setAttribute('depth', "0.2");
      setTimeout(function () {
        btn.setAttribute('depth', "0.4");
      }, 100);
    });
  }
});

// 정보 on/off 버튼
AFRAME.registerComponent('show-info', {
  init: function () {
    var onbtn = document.querySelector("#onbtn");
    var offbtn = document.querySelector("#offbtn");
    var progressPanel = document.querySelector("#progress_panel");
    var infoPanel = document.querySelector("#property-panel");
    var playbox = document.querySelector("#playbtn");
    var rewindbox = document.querySelector("#rewindbtn");
    var wbox = document.querySelector("#wbtn");
    var sbox = document.querySelector("#sbtn");
    var abox = document.querySelector("#abtn");
    var dbox = document.querySelector("#dbtn");
    var upbox = document.querySelector("#upbtn");
    var dnbox = document.querySelector("#dnbtn");
    var visibleimg = document.querySelector('#visibleimg');
    var panel = document.querySelector('#panel');
    var panelBckgrnd = document.querySelector('#panelBackground');
    var prpset = document.querySelector('#prpsetInfo');
    var playbtn = document.querySelector("#playbtn");
    var pausebtn = document.querySelector("#pausebtn");
    modelid = 0;

    var visible = true
    onbtn.addEventListener("click", (e) => {

      if (visible) {
        visible = false

        offbtn.setAttribute('visible', 'true');
        progressPanel.setAttribute('visible', "false");
        infoPanel.setAttribute('visible', "false");
        visibleimg.setAttribute('material', 'opacity', '0');
        playbox.setAttribute('visible', "false");
        rewindbox.setAttribute('visible', "false");
        wbox.setAttribute('visible', "false");
        sbox.setAttribute('visible', "false");
        abox.setAttribute('visible', "false");
        dbox.setAttribute('visible', "false");
        upbox.setAttribute('visible', "false");
        dnbox.setAttribute('visible', "false");
        panel.setAttribute('visible', "false");
        panelBckgrnd.setAttribute('visible', "false");
        prpset.setAttribute('visible', "false");
        playbtn.setAttribute('visible', "false");
        pausebtn.setAttribute('visible', "false");
        ifcLoader.ifcManager.removeSubset(modelid, mat);
      }
      else {
        visible = true

        onbtn.setAttribute('visible', 'true');
        offbtn.setAttribute('visible', 'false');
        progressPanel.setAttribute('visible', "true");
        infoPanel.setAttribute('visible', "true");
        visibleimg.setAttribute('material', 'opacity', '1');
        playbox.setAttribute('visible', "true");
        rewindbox.setAttribute('visible', "true");
        wbox.setAttribute('visible', "true");
        sbox.setAttribute('visible', "true");
        abox.setAttribute('visible', "true");
        dbox.setAttribute('visible', "true");
        upbox.setAttribute('visible', "true");
        dnbox.setAttribute('visible', "true");
        panel.setAttribute('visible', "true");
        panelBckgrnd.setAttribute('visible', "true");
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