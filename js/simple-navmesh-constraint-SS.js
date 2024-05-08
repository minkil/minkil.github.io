/* global AFRAME, THREE */

AFRAME.registerComponent('simple-navmesh-constraint', {
  schema: {
    enabled: {
      default: true
    },
    navmesh: {
      default: ''
    },
    fall: {
      default: 0.5
    },
    height: {
      default: 1.0
    },
    exclude: {
      default: ''
    },
    xzOrigin: {
      default: ''
    }
  },
  
  update: function () {
    this.lastPosition = null;
    this.excludes = this.data.exclude ? Array.from(document.querySelectorAll(this.data.exclude)):[];
    const els = Array.from(document.querySelectorAll(this.data.navmesh));
    if (els === null) {
      console.warn('simple-navmesh-constraint: Did not match any elements');
      this.objects = [];
    } else {
      this.objects = els.map(el => el.object3D).concat(this.excludes.map(el => el.object3D));
    }
    this.xzOrigin = this.data.xzOrigin ? this.el.querySelector(this.data.xzOrigin) : this.el;
  },

  tick: (function () {
    const nextPosition = new THREE.Vector3();
    const tempVec = new THREE.Vector3();
    const scanPattern = [
      // [angle, distance]
      [0,1], // Default the next location
      [0,0.5], // Check that the path to that location was fine
      [30,0.4], // A little to the side shorter range
      [-30,0.4], // A little to the side shorter range
      [60,0.2], // Moderately to the side short range
      [-60,0.2], // Moderately to the side short range
      [80,0.06], // Perpendicular very short range
      [-80,0.06], // Perpendicular very short range
    ];
    const down = new THREE.Vector3(0,-1,0);
    const raycaster = new THREE.Raycaster();
    const gravity = -1;
    const maxYVelocity = 0.5;
    const results = [];
    let yVel = 0;
    let firstTry = true;
    
    return function tick(time, delta) {
      if (this.data.enabled === false) return;
      if (this.lastPosition === null) {
        firstTry = true;
        this.lastPosition = new THREE.Vector3();
        this.xzOrigin.object3D.getWorldPosition(this.lastPosition);
        if (this.data.xzOrigin) this.lastPosition.y -= this.xzOrigin.object3D.position.y;
      }
      
      const el = this.el;
      if (this.objects.length === 0) return;

      this.xzOrigin.object3D.getWorldPosition(nextPosition);
      if (this.data.xzOrigin) nextPosition.y -= this.xzOrigin.object3D.position.y;
      if (nextPosition.distanceTo(this.lastPosition) <= 0.01) return; // next position과 last position 사이의 위치 변화가 일정 값 이상이어야만 추가 작업을 수행하도록 함
      
      let didHit = false;
      // So that it does not get stuck it takes as few samples around the user and finds the most appropriate
      scanPatternLoop:
      for (const [angle, distance] of scanPattern) {
        tempVec.subVectors(nextPosition, this.lastPosition); 
        
        let dist0 = tempVec.length();

        raycaster.set(this.lastPosition, tempVec); // 충돌 검사에 사용할 출발 위치(this.lastPosition)와 방향(tempVec)을 지정함

        raycaster.intersectObjects(this.objects, true, results); 

        if (results.length) { 
          for (const result of results) { 
            if(result.distance > dist0) 
              continue;
              
            let exp_id   = ifcLoader.ifcManager.getExpressId(result.object.geometry, result.faceIndex);
            let ifc_type = ifcLoader.ifcManager.getIfcType(0, exp_id);

            if(ifc_type !=null){
              ifc_type = ifc_type.toUpperCase();  
            }

            if(ifc_type =="IFCWALL" ||
            ifc_type =="IFCWALLSTANDARDCASE"||
            ifc_type =="IFCCOLUMN"||
            ifc_type =="IFCCURTAINWALL" ||
            ifc_type == "IFCRAILING" ||
            ifc_type == "IFCPLATE" ||
            ifc_type == "IFCFURNISHINGELEMENT"
            ){
              results.splice(0);
              continue scanPatternLoop;
            }
          }
        }

        results.splice(0);
        
        tempVec.applyAxisAngle(down, angle*Math.PI/180); 
        tempVec.multiplyScalar(distance); 
        tempVec.add(this.lastPosition);  
        tempVec.y += maxYVelocity; // tempVec의 y좌표에 maxYVelocity 값을 더함. 이를 통해 Y방향으로의 속도를 설정
        tempVec.y -= this.data.height; // tempVec의 Y좌표에서 height 데이터 속성값을 뺌. 이를 통해 el의 높이를 고려하여 위치를 조정
        //tempVec.y -= el.getAttribute('height') || 0;
        raycaster.set(tempVec, down); 
        raycaster.far = this.data.fall > 0 ? this.data.fall + maxYVelocity : Infinity; 
        raycaster.intersectObjects(this.objects, true, results); 
        
        if (results.length) {
          // If it hit something we want to avoid then ignore it and stop looking
          for (const result of results) { 
            if(this.excludes.includes(result.object.el)) {
              results.splice(0); // 충돌 결과 배열 비움
              continue scanPatternLoop;
            }
          }
          const hitPos = results[0].point; 
          results.splice(0); 
          hitPos.y += this.data.height; // 충돌 지점의 y좌표에 컴포넌트 높이('this.data.height: 1.6')를 더함. 이를통해 엘리먼트가 충돌한 객체 위로 올라감
          //hitPos.y += el.getAttribute('height') || 0;
          if (nextPosition.y - (hitPos.y - yVel*2) > 0.01) { 
            yVel += Math.max(gravity * delta * 0.001, -maxYVelocity); 
            hitPos.y = nextPosition.y + yVel; // 충돌지점의 y좌표 업데이트. 이를 통해 다음 위치 설정.
          } else {
            yVel = 0;
          }
          tempVec.copy(hitPos); 
          this.xzOrigin.object3D.parent.worldToLocal(tempVec); 
          tempVec.sub(this.xzOrigin.object3D.position); 
          if (this.data.xzOrigin) tempVec.y += this.xzOrigin.object3D.position.y;
          // xzOrigin 엘리먼트가 지정되어 있을 경우, tempVec의 y좌표에 xzOrigin el의 y좌표를 더함. 이를통해 el이 올바른 높이로 이동하도록 함
          this.el.object3D.position.add(tempVec); 
          
          this.lastPosition.copy(hitPos); 
          didHit = true; 
          break; 
        }
        
      }
      
      if (didHit) {
        firstTry = false;
      }
      
      if (!firstTry && !didHit) {
        this.el.object3D.position.copy(this.lastPosition);
        this.el.object3D.parent.worldToLocal(this.el.object3D.position);
      }
    }
  }())
});

