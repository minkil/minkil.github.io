        //  // 버튼 맨 앞으로
        //  AFRAME.registerComponent("overlay", {
        //   dependencies: ['material'],
        //   tick: function (time, timeDelta) {
        //     this.el.sceneEl.renderer.sortObjects = true;
        //     this.el.object3D.renderOrder = 100;
        //     this.el.components.material.material.polygonOffset = true;
        //     this.el.components.material.material.polygonOffsetUnit = 1;
        //     this.el.components.material.material.polygonOffsetFactor = 1;
        //     this.el.components.material.material.depthTest = false;
        //     this.el.components.material.material.depthWrite = false;
        //     //this.el.components.material.material.blending = THREE.AdditiveBlending
        //   }
        // });
        // // 글씨 맨 앞으로
        // AFRAME.registerComponent("overlay_text", {
        //   dependencies: ['material'],
        //   tick: function (time, timeDelta) {
        //     this.el.sceneEl.renderer.sortObjects = true;
        //     this.el.object3D.renderOrder = 100;
        //     this.el.components.text.material.polygonOffset = true;
        //     this.el.components.text.material.polygonOffsetUnit = 1;
        //     this.el.components.text.material.polygonOffsetFactor = 1;
        //     this.el.components.text.material.depthTest = false;
        //     this.el.components.text.material.depthWrite = false;
        //     //this.el.components.text.material.blending = THREE.AdditiveBlending
        //   }
        // });

      // 버튼 맨 앞으로
      AFRAME.registerComponent("overlay", {
        dependencies: ['material'],
        tick: function () {
          this.el.sceneEl.renderer.sortObjects = true;
          this.el.object3D.renderOrder = 100;
          this.el.components.material.material.depthTest = false;
        }
      });
      // 글씨 맨 앞으로
      AFRAME.registerComponent("overlay_text", {
        dependencies: ['material'],
        tick: function () {
          this.el.sceneEl.renderer.sortObjects = true;
          this.el.object3D.renderOrder = 100;
          this.el.components.text.material.depthTest = false;
        }
      });