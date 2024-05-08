AFRAME.registerComponent('rotate-controls', {
    schema: {
      angle: { type: 'number', default: 45 }, 
      cameraRig: { type: 'selector', default: '#player' }
    },
  
    init: function () {
      const data = this.data
      const el = this.el
      
      this.snapturnRotation = THREE.MathUtils.degToRad(this.data.angle)
  
      this.canSnapturn = true
  
      this.cameraRig = this.data.cameraRig
  
      this.handleThumbstickAxis = this.handleThumbstickAxis.bind(this)
  
      el.addEventListener('thumbstickmoved', this.handleThumbstickAxis)
    },
  
    handleSnapturn: function (rotation, strength) {
      if (strength < 0.50)
        this.canSnapturn = true
  
      if (!this.canSnapturn)
        return
  
      // Only do snapturns if axis is very prominent (user intent is clear)
      // And preven further snapturns until axis returns to (close enough to) 0
      if (strength > 0.95) {
        if (Math.abs(rotation - Math.PI / 2.0) < 0.6) {
          this.cameraRig.object3D.rotateY(+this.snapturnRotation)
          this.canSnapturn = false
        } else if (Math.abs(rotation - 1.5 * Math.PI) < 0.6) {
          this.cameraRig.object3D.rotateY(-this.snapturnRotation)
          this.canSnapturn = false
        }
      }
    },
  
    handleThumbstickAxis: function (evt) {
      if (evt.detail.x !== undefined && evt.detail.y !== undefined) {
        const rotation = Math.atan2(evt.detail.x, evt.detail.y) + Math.PI
        const strength = Math.sqrt(evt.detail.x ** 2 + evt.detail.y ** 2)
  
        this.handleSnapturn(rotation, strength)
      }
    }
  });