AFRAME.registerComponent('scenemgr', {
    schema:{
        cursor:{type:'selector', default:'a-cursor'},
        activeCamRig:{type:'selector', default:'#cameraRig'},

    },

    init: function(){
        let el = this.el;
        let data = this.data;

        el.addEventListener('enter-vr', evt=>{
          console.log("Enter VR");
            data.cursor.setAttribute('visible', false);
            data.cursor.setAttribute('raycaster', 'enabled', false);
            data.activeCamRig.setAttribute('movement-controls','enabled', false);

        });
        
        el.addEventListener('exit-vr', evt=>{
          console.log("Exit VR");
            data.cursor.setAttribute('visible', true);
            data.cursor.setAttribute('raycaster', 'enabled', true);
            data.activeCamRig.setAttribute('movement-controls', 'enabled', true);
        });
    }
});

AFRAME.registerComponent('pointer', {
    // built-in methods
    schema:{
    },

    init:function(){
    },
    
    play:function(){
        const el = this.el;// grab scope
        
        // On click event
        el.addEventListener('click', (evt) => {
            let target = evt.detail.intersectedEl;
            console.log("Target clicked:", target);
        });

        // When hovering on a clickable item, change the cursor colour.
        el.addEventListener('mouseenter', (evt)=>{
            console.log("mouse enter");
            el.setAttribute('material', {color: '#00ff00'});
            let target = evt.detail.intersectedEl;
            target.object3D.el.setAttribute('color', '#'+(Math.random()*0xFFFFFF<<0).toString(16));// just for fun
        });

        el.addEventListener('mouseleave', (evt)=>{
            console.log("mouse leave");
           el.setAttribute('material', {color: '#ffffff'});
        });
    }
});