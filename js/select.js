    // floor 변경 
    function setFloor() {
      var select = document.getElementsByName('floors')[0].value;
      var player = document.querySelector("#camera");
      var pos = player.getAttribute("position");
      var navmesh = player.components["simple-navmesh-constraint"];
      if (navmesh != null)
        navmesh.lastPosition = null;
      if (select == -1) {
        pos = { x: 2, y: -1.9, z: -5 }
        player.setAttribute("position", pos);
      }
      if (select == 1) {
        pos = { x: -0.6, y: 2.5, z: -8.15 }
        player.setAttribute("position", pos);
      }
      if (select == 2) {
        pos = { x: -0.6, y: 5.7, z: -8.15 }
        player.setAttribute("position", pos);
      }
      if (select == 3) {
        pos = { x: -0.6, y: 9.3, z: -8.15 }
        player.setAttribute("position", pos);
      }
      if (select == 4) {
        pos = { x: -0.6, y: 12.9, z: -8.15 }
        player.setAttribute("position", pos);
      }
      if (select == 5) {
        pos = { x: -0.6, y: 16.5, z: -8.15 }
        player.setAttribute("position", pos);
      }
      if (select == 6) {
        pos = { x: -0.6, y: 20.4, z: -8.15 }
        player.setAttribute("position", pos);
      }
    }

    // 설비 선택 변경 
    function setDistributionLv() {
      var select = document.getElementsByName('MEPLV')[0].value;
      if (select == 0) { 
        for (let key of type_subsets.keys()) { 
          setTypeTransparent(key, false);
        } 
        setSlabTransparent("IFCSLAB",false);
        setSlabTransparent("IFCCOVERING",false);
        
        for (let value of distribution_subsets.values()) { 
          value.visible = true;
        } 
       
      }
      else if (select == 1) { 
        for (let key of type_subsets.keys()) { 
          setTypeTransparent(key, true);
        } 
        setSlabTransparent("IFCSLAB",true);
        setSlabTransparent("IFCCOVERING",true);
        
        for (let value of distribution_subsets.values()) { 
          value.visible = true;
        } 
        for(let key of beam_subsets.keys()) 
        { 
          let value = beam_subsets.get(key);
          value.visible = false;
        }
       
      }
      else  { 
        for (let key of type_subsets.keys()) { 
          setTypeTransparent(key, true);
        }
        setSlabTransparent("IFCSLAB",true);
        setSlabTransparent("IFCCOVERING",true);

        for(let key of distribution_subsets.keys()) { 
          let value = distribution_subsets.get(key);
          if(value == null) continue;
          
        for(let key of beam_subsets.keys()) 
        { 
          let value = beam_subsets.get(key);
          value.visible = false;
        }

          if(key == select)
            value.visible = true;
          else
            value.visible = false; 
        } 
      }
    }
    
    // beam 선택 변경 
    function setBeamLv() {
      var select = document.getElementsByName('ReferenceLevel')[0].value;
      if (select == 0) { 
        for (let key of type_subsets.keys()) { 
          setTypeTransparent(key, false);
        } 
        setSlabTransparent("IFCSLAB",false);
        setSlabTransparent("IFCCOVERING",false);
        
        for (let value of beam_subsets.values()) { 
          value.visible = true;
        } 
       
      }
      else if (select == 1) { 
        for (let key of type_subsets.keys()) { 
          setTypeTransparent(key, true);
        } 
        setSlabTransparent("IFCSLAB",true);
        setSlabTransparent("IFCCOVERING",true);
        
        for (let value of beam_subsets.values()) { 
          value.visible = true;
        } 
        for(let key of distribution_subsets.keys()) 
        { 
          let value = distribution_subsets.get(key);
          value.visible = false;
        }
       
      }
      else  { 
        for (let key of type_subsets.keys()) { 
          setTypeTransparent(key, true);
        }
        setSlabTransparent("IFCSLAB",true);
        setSlabTransparent("IFCCOVERING",true);

        for(let key of beam_subsets.keys()) { 
          let value = beam_subsets.get(key);
          if(value == null) continue;

          for(let key of distribution_subsets.keys()) 
          { 
            let value = distribution_subsets.get(key);
            value.visible = false;
          }

          if(key == select)
            value.visible = true;
          else
            value.visible = false; 
        } 
      }
    }

  var distribution_subsets = new Map();
  var beam_subsets = new Map();

    async function collectDstrbLv(node, distributionMap, level) {
      let modelid = 0;
      let type = await ifcLoader.ifcManager.getIfcType(modelid, node.expressID);
      if (node.expressID == null)
        return;  
      try {
      if (type == "IFCBUILDINGSTOREY"){
        let props = await ifcLoader.ifcManager.getItemProperties(modelid, node.expressID);
        level = props['Name']?.value;
      }
        if (type == "IFCDISTRIBUTIONELEMENT") {
          if (!distributionMap.has(level)) 
          {
            distributionMap.set(level, []);
          }
            distributionMap.get(level).push(node.expressID);
        }
      }
      catch {
        return;
      } 
      if (node.children != null) {
        for (let ch of node.children) {
          await collectDstrbLv(ch, distributionMap, level);
        }
      }
    }

    async function loadDistributionMap() {
      let ifcProject = await ifcLoader.ifcManager.getSpatialStructure(0);
      var distributionMap = new Map();
      await collectDstrbLv(ifcProject.children[0].children[0], distributionMap, null);
  
      for (let [key, value] of distributionMap) {
        let subset = ifcLoader.ifcManager.createSubset(
          {
            modelID: 0,
            ids: value,
            scene: scene,
            removePrevious: true,
            customID: key
          });
  
          distribution_subsets.set(key, subset);
      }
    }

    async function collectBeamLv(node, beamMap, level) {
      let modelid = 0;
      let type = await ifcLoader.ifcManager.getIfcType(modelid, node.expressID);
      if (node.expressID == null)
        return;  
      try {
      if (type == "IFCBUILDINGSTOREY"){
        let props = await ifcLoader.ifcManager.getItemProperties(modelid, node.expressID);
        level = props['Name']?.value;
      }
        if (type == "IFCBEAM") {
          if (!beamMap.has(level)) 
          {
            beamMap.set(level, []);
          }
          beamMap.get(level).push(node.expressID);
        }
      }
      catch {
        return;
      } 
      if (node.children != null) {
        for (let ch of node.children) {
          await collectBeamLv(ch, beamMap, level);
        }
      }
    }

    async function loadBeamMap() {
      let ifcProject = await ifcLoader.ifcManager.getSpatialStructure(0);
      var beamMap = new Map();
      await collectBeamLv(ifcProject.children[0].children[0], beamMap, null);
  
      for (let [key, value] of beamMap) {
        let subset = ifcLoader.ifcManager.createSubset(
          {
            modelID: 0,
            ids: value,
            scene: scene,
            removePrevious: true,
            customID: key + " Beam" // distribution과 구분하기 위해
          });
  
          beam_subsets.set(key, subset);
      }
    }