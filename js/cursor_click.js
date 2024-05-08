    // 현재 마우스 위치 알아내기
    var currentMouseMove;
    document.addEventListener('mousemove', (event) => {
      const x1 = event.clientX;
      const x2 = document.querySelectorAll('#a_scene')[0].clientWidth;
      const y1 = event.clientY;
      const y2 = document.querySelectorAll('#a_scene')[0].clientHeight;

      currentMouseMove = {
        x: (x1 / x2) * 2 - 1,
        y: - (y1 / y2) * 2 + 1
      };
    });

    // 현재 터치 위치 알아내기
    var currentTouchMove;
    var touchStartTime;
    function touchEventHandler(event) {
      if (!infoHide.checked) {
        if (event.type == "touchstart") {
          console.log("touch started")
          // 1초 이상 touch 하고 있어야 정보가 보이고 손을 떼면 정보가 사라짐
          touchStartTime = new Date().getTime();
          setTimeout(function () {
            if (new Date().getTime() - touchStartTime >= 1000) {
              // 화면에서 canvas에 해당되는 것만 터치할 수 있게 함
              if (!(event.srcElement instanceof HTMLCanvasElement))
                return;
              // 스크린에서 touch 위치 가져오기
              const x1 = event.targetTouches[0].clientX;
              const x2 = document.querySelectorAll('#a_scene')[0].clientWidth;
              const y1 = event.targetTouches[0].clientY;
              const y2 = document.querySelectorAll('#a_scene')[0].clientHeight;
              currentTouchMove = {
                x: (x1 / x2) * 2 - 1,
                y: - (y1 / y2) * 2 + 1
              };
              click_act(event, currentTouchMove);
              htmlPsetInfo.style.visibility = "visible";
            }
          }, 1000);
        }
        else if (event.type == "touchend") {
          console.log("touch ended")
          ifcLoader.ifcManager.removeSubset(0, mat);
          htmlPsetInfo.style.visibility = "hidden";
          clearTimeout();
        }
      }
    }

    document.addEventListener('touchstart', touchEventHandler, { passive: true });
    // touchEventHandler 함수 찢어서 이 안에 각각 넣어보기
    document.addEventListener('touchend', touchEventHandler, { passive: true });

    // raycasting 함수 for laser-controls
    function getPickingRaycaster(entity) {
      var laserPoint = entity;
      let raycaster = laserPoint.components['raycaster'].raycaster;
      return raycaster;
    }

    // click 하는 object highlight 하는 material
    const mat = new MeshLambertMaterial({
      transparent: true,
      opacity: 0.4,
      color: 0x000000,
      // depthTest: false,
    });


    // 선택한 object 해당되는 날짜 보여주기
    function showDateInfo(guid) {
      let tskElm = taskScheduler.find_element(guid);
      var curDt = "";
      var dateInfoDiv = document.getElementById("date_info");
      if (tskElm != null) {
        curDt = `${tskElm?.sdate.toLocaleDateString()} ~ ${tskElm?.edate.toLocaleDateString()}`;
      }
      // dateInfoDiv.textContent = "시공날짜: " + curDt;
    }

    // 선택한 object 해당되는 가격 보여주기
    function showCostInfo(guid) {
      let tskElm = taskScheduler.find_element(guid);
      var curCt = tskElm?.cost ?? "";
      curCt = Math.round(curCt);
      curCt = curCt.toLocaleString('en-US');
      var costInfoDiv = document.getElementById("cost_info");
      if (curCt != 0) {
        costInfoDiv.textContent = "공사금액: " + curCt + "원";
      }
      else {
        costInfoDiv.textContent = " ";
      }
    }

    // object 선택시 시공 날짜와 측정 금액 보여주는 함수
    function GetDateCost(id) {
      ifcLoader.ifcManager.getItemProperties(0, id).then(props_ => {
        guid = props_.GlobalId.value;
        showDateInfo(guid);
        showCostInfo(guid);
      });
    }

    //부모 계단 express Id 찾는 함수
    function GetParentStairId(expid) {
      //자식유무
      let hasChild = false
      for (let stair of stMap.values()) {
        //계단에 자식이 있을 경우 
        if (stair.children != null) {
          //자식 중에 express id가 일치하는 자식을 찾는다
          for (let ch of stair.children) {
            if (ch.expressID == expid) {
              hasChild = true
              //찾으면 부모계단의 expressid를 return
              return stair.expressID;
            }
          }
        }
      }
      // 자식이 없을 경우 본래 expressid를 return
      if (hasChild == false)
        return expid
    }

    // ifc 클릭시 info 보여주는 함수
    async function click_act(e, currentDownMove) {
      let raycaster = null;
      if (e.target?.hasAttribute("laser-controls")) {
        raycaster = getPickingRaycaster(e.target);
      }
      else if (e.target?.hasAttribute("cursor")) {
        if (AFRAME.scenes[0].states.indexOf("vr-mode") > -1) {
          return;
        }
        raycaster = new THREE.Raycaster();
        let cam = document.querySelector("[camera]").getObject3D('camera');
        raycaster.setFromCamera(currentDownMove, cam);
      }

      if (raycaster == null) {
        raycaster = new THREE.Raycaster();
        let cam = document.querySelector("[camera]").getObject3D('camera');
        raycaster.setFromCamera(currentDownMove, cam);
      }

      if (scene != null && raycaster != null) {
        let isects = raycaster.intersectObject(scene)?.filter(o_ => o_.object?.visible == true); // 아직 load되지 않은 object는 클릭되지 않게
        intersects = (isects != null && isects.length > 0) ? isects[0] : null;
      }
      else
        intersects = null;

      // modelid = intersects.object.modelID;
      modelid = 0;

      if (intersects) {
        const index = intersects.faceIndex;
        const geometry = intersects.object.geometry;
        const ifc = ifcLoader.ifcManager;
        const expid = ifc.getExpressId(geometry, index);
        exIds = [expid];
        let prpsets = await ifc.getPropertySets(modelid, expid, false);
        let types = await ifc.getTypeProperties(modelid, expid, false); // 아래 type이랑 다름
        const type = ifc.getIfcType(modelid, expid);

        console.log(type, expid);

        // click한 object higlight
        if (infoHide.checked == false) {
          ifc.createSubset({
            modelID: modelid,
            ids: exIds,
            material: mat,
            scene: scene,
            removePrevious: true,
          });
        }

        // 계단일 경우
        if (type == "IFCSTAIR") {
          let pId = GetParentStairId(expid);
          //부모 계단의 propertysets을 가져온다.
          prpsets = await ifc.getPropertySets(modelid, pId, false);
          types = await ifc.getTypeProperties(modelid, pId, false);
          //부모 계단의 날짜, 가격정보를 가져온다.
          GetDateCost(pId)
        }
        else {
          GetDateCost(expid)
        }

        // 프로퍼티셋 보여주는 부분
        var prpValType = '';
        var prpValTypeId = '';
        var prpValCategory = '';
        var prpValHeight = '';

        for (let typ_ of types) {
          for (let p_ of typ_.HasPropertySets) {
            let pset = ifcLoader.ifcManager.state.api.GetLine(0, p_.value, true);
            if (pset != null)
              prpsets.push(pset);
          }
        }
        for (let pset_ of prpsets) {
          if (pset_.Name == null) continue;

          let nm = pset_.Name.value;
          if (nm == "Other") {
            for (let p_ of pset_.HasProperties) {
              if (p_.Name == null) continue;
              let pnm = p_.Name.value;
              let vnm = p_.NominalValue.value;
              if (pnm == "구조형식") {
                prpValHeight = prpValHeight.concat(`${pnm}\n: ${vnm}`);
              }
            }
          }
          if (nm == "Data") {
            for (let p_ of pset_.HasProperties) {
              if (p_.Name == null) continue;
              //let v = ifcLoader.ifcManager.state.api.GetLine(0, p_.value, true);
              let pnm = p_.Name.value;
              let vnm = p_.NominalValue.value;
              if (pnm == "교체주기") {
                prpValType = prpValType.concat(`${pnm}\n: ${vnm}`);
              }
              if (pnm == "마지막 교체 날짜") {
                prpValTypeId = prpValTypeId.concat(`${pnm}\n: ${vnm}`);
              }
              if (pnm == "마지막 점검 날짜") {
                prpValCategory = prpValCategory.concat(`${pnm}\n: ${vnm}`);
              }
              if (pnm == "제품정보") {
                vnm = vnm.substr(2);
                prpValHeight = prpValHeight.concat(`${pnm}\n: ${vnm.slice(0, -14)}`);
              }
            }
          }
        }
        if (prpValType != null) prpValTypeInfo.textContent = prpValType;
        if (prpValTypeId != null) prpValTypeIdInfo.textContent = prpValTypeId;
        if (prpValCategory != null) prpValCategoryInfo.textContent = prpValCategory;
        if (prpValHeight != null) prpValHeightInfo.textContent = prpValHeight;


        // 선택한 entity 색상 변경
        const backgroundColorPicker = document.querySelector('#backgroundColorPicker');
        // 여기서 input 에 계속 들어옴. 한번 클릭할때 한번만 들어오게 해야 함 
        // input 이 아닌 다른 게 있는지 확인하거나 createSubset 대신 material만 가져와서 변경할 수 있는지 확인
        backgroundColorPicker.addEventListener('input', () => {
          console.log("input")
          const selectedColor = backgroundColorPicker.value;
          // material
          const pickColorMat = new MeshLambertMaterial({
            transparent: true,
            opacity: 0.4,
            color: selectedColor,
          });

          const pickColorMatTransparent = new MeshLambertMaterial({
            transparent: true,
            opacity: 0.1,
            color: selectedColor,
          });

          // ifc plate일경우엔 투명도를 주고 싶은데 처음 한번만 실행되고 두번째 바꾸려고 하면 opacity 1로 다시 됨
          if (type == "IFCPLATE") {
            ifc.createSubset({
              modelID: modelid,
              ids: exIds,
              material: pickColorMatTransparent,
              scene: scene,
              removePrevious: true,
            });
          }
          else {
            ifc.createSubset({
              modelID: modelid,
              ids: exIds,
              material: pickColorMat,
              scene: scene,
              removePrevious: true,
            });
          }

          // 되돌리기 버튼 부분. 전체 색깔이 다 되돌려짐. 선택한 부분만 되돌려지지 않음
          var colorResetBttn = document.querySelector("#reset");
          colorResetBttn.addEventListener("click", (e) => {
            ifc.removeSubset(modelid, pickColorMat);
            ifc.removeSubset(modelid, pickColorMatTransparent);
          });
        });
      }
    }


    AFRAME.registerComponent("cursor_click", {
      init: function () {
        let onClick = async (e) => {
          click_act(e, currentMouseMove);
        };
        if (this.el.hasAttribute("laser-controls")) {
          this.el.addEventListener("triggerdown", async (e) => { await onClick(e) });
        }
        else if (this.el.hasAttribute("cursor")) {
          this.el.addEventListener("click", async (e) => { await onClick(e) });
        }
      }
    });