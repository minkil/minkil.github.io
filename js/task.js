class Task {
    constructor() {
        this.sdate = "";
        this.edate = "";
        this.elements = [];
        this.cost = 0;
        this.objectIds = [];
    }
    collectChNodes(node, cnodes) {
        if (node.children != null) {
            for (let ch of node.children) {
                if (ch == null)
                    continue;

                cnodes.push(ch.expressID);
                this.collectChNodes(ch, cnodes);
            }
        }
    }
    load(json, map) {
        this.sdate = new Date(json["sdate"]);
        this.edate = new Date(json["edate"]);

        this.elements = json["elements"];

        for (let elm of this.elements) {
            this.cost += elm["cost"];
            let guid = elm["guid"];

            if (map.has(guid)) {
                let ifcNd = map.get(guid);
                this.objectIds.push(ifcNd.expressID);

                if (ifcNd.type != "IFCSITE") {
                    let chNodes = [];
                    this.collectChNodes(ifcNd, chNodes);
                    this.objectIds.push(...chNodes);
                }
            }
        }
    }
    init() {
        //Ifc객체  Subset 생성
        let ids = this.objectIds;
        this.subSet = ifcLoader.ifcManager.createSubset({
            modelID: 0,
            scene: scene,
            ids: ids,
            removePrevious: true,
            customID: `task_${this.tasknum}`,
        });

        this.highlightSubSet = this.subSet.clone();
        this.highlightSubSet.visible = false;
        this.subSet.parent.add(this.highlightSubSet);

        this.material = this.subSet.material;
        this.highlightMaterial = [];

        this.material.forEach((mat) => {
            let hilightMat = mat.clone();
            // hilightMat.color.setColorName("DarkSlateBlue"); 
            // hilightMat.color.setColorName("Maroon"); 
            // hilightMat.color.setColorName("SaddleBrown"); 
            // hilightMat.color.setColorName("MidnightBlue"); 
            hilightMat.color.setColorName("purple");
            hilightMat.transparent = true;
            hilightMat.opacity = 0.5;
            hilightMat.needsUpdate = true;
            // hilightMat.depthTest = true;
            // hilightMat.blending = THREE.AdditiveBlending

            this.highlightMaterial.push(hilightMat);
        });

        this.highlightSubSet.material = this.highlightMaterial;

    }
    highlight() {
        this.subSet.visible = false;
        this.highlightSubSet.visible = true;
    }
    removeHighlight() {
        this.subSet.visible = true;
        this.highlightSubSet.visible = false;
    }
    update(date) {
        if (!this.isInit) {
            this.init();
            this.isInit = true;
        }
        if (date > this.edate) {
            this.subSet.visible = true;
            this.removeHighlight(this.subSet);
        }
        else if (this.sdate <= date && this.edate >= date) {
            this.highlight(this.subSet);
        }
        else if (date < this.sdate) {
            this.subSet.visible = false;
            this.highlightSubSet.visible = false;
        }
    }
}

class TaskGroup {
    constructor() {
        this.tasks = [];
        this.name = "";
    }

    sdate() {
        return this.tasks[0]?.sdate;
    }
    edate() {
        return this.tasks[this.tasks.length - 1]?.edate;
    }

    load(json, map) {
        for (let tskNm in json) {
            let task = new Task();
            task.name = tskNm;
            task.load(json[tskNm], map);

            this.tasks.push(task);
        }

        this.tasks = this.tasks.sort((a_, b_) => {
            if (a_.sdate < b_.sdate) return -1;
            if (a_.sdate > b_.sdate) return 1;
            return 0;
        })
    }

    init() {
    }
    update(date) {
        for (let task of this.tasks) {
            task.update(date);
        }
    }
}
class TaskScheduler {
    constructor() {
       // this.speed = 150;
        this.speed = 100; // progress point 속도조절
        this.map;
        this.taskgroups = [];
        this.sdate = null;
        this.edate = null;
    }
    find_element(guid) {
        for (let grp of this.taskgroups) {
            if (grp.tasks.length == 0)
                continue;
            for (let tsk of grp.tasks) {
                for (let elm of tsk.elements) {
                    if (elm.guid == guid)
                        return {
                            "sdate": tsk.sdate,
                            "edate": tsk.edate,
                            "cost": elm.cost,
                        };
                }
            }
        }
        return null;
    }
    current_date() {
        if (this.sdate == null || this.currentDate == null) return null;
        let currentDate = this.currentDate;
        return currentDate.toLocaleDateString();
    }
    last_date() {
        if (this.sdate == null || this.currentDate == null) return null;
        let currentDate = this.edate;
        return currentDate.toLocaleDateString();
    }
    current_loc() {
        if (this.sdate == null || this.currentDate == null) return 0;

        let currentDate = this.currentDate;
        let s = this.sdate.getTime();
        let e = this.edate.getTime();
        let c = currentDate.getTime();
        return (c - s) / (e - s);
    }
    current_cost() {
        let cost = 0;
        for (let grp of this.taskgroups) {
            if (grp.tasks.length == 0)
                continue;
            for (let tsk of grp.tasks) {
                if (tsk.edate <= this.currentDate)
                    cost += tsk.cost;
            }
        }

        cost = Math.round(cost); 
        return cost;
    }
    all_cost() {
        let cost = 0;
        for (let grp of this.taskgroups) {
            if (grp.tasks.length == 0)
                continue;
            for (let tsk of grp.tasks) {
                cost += tsk.cost;
                if (tsk.edate == this.currentDate)
                return;                   
            }
        }
        cost = Math.round(cost); 
        return cost;
    }
    load(json) {

        let taskNum = 0;

        for (let flName in json) {
            let jsongrp = json[flName];
            let grp = new TaskGroup();
            grp.name = flName;
            grp.load(jsongrp, this.map);

            this.taskgroups.push(grp);
            for (let tsk of grp.tasks) {
                tsk.tasknum = taskNum++;
            }
        }

        let usedIds = new Map();
        for (let grp of this.taskgroups) {
            if (grp.tasks.length == 0)
                continue;
            if (this.sdate == null || this.sdate > grp.sdate()) {
                this.sdate = grp.sdate();
            }
            if (this.edate == null || this.edate < grp.edate()) {
                this.edate = grp.edate();
            }
            for (let tsk of grp.tasks) {
                for (let id of tsk.objectIds) {
                    usedIds.set(id, true);
                }
            }
        }

        // load 되지 않은 subset의 id를 따로 모아서 다시 load하기 위해 작성 한 코드

        let unusedIds = [];
        for (let nd of this.map.values()) {
            if (usedIds.has(nd.expressID))
                continue;
            unusedIds.push(nd.expressID);

        }

        this.subSet = ifcLoader.ifcManager.createSubset({
            modelID: 0,
            scene,
            ids:unusedIds,
            removePrevious: true,
            customID: `site_1`,
        });

        this.subSet.visible =false; // 아이디가 없으면 처음부터 보이지 않게
        this.tasks = [];
        this.startD = null;
        this.endD = null;
        this.currentD = 0;

        this.play();
    }
    isPlaying() {
        return this.interval != null;
    }
    play() {
        this.clearInterval();
        this.currentD = this.startD;
        this.interval = setInterval(() => this.update(), this.speed); // 1초 간격으로 보여줌(setInverval)
    }
    stop() {
        this.clearInterval();
        this.currentD = this.startD;
    }
    pause() {
        this.clearInterval();
    }
    resume() {
        this.clearInterval();
        this.interval = setInterval(() => this.update(), this.speed);
    }
    clearInterval() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }
    update() {

        this.currentDate = new Date();
        this.currentDate.setTime(this.sdate.getTime() + this.currentD * 24 * 60 * 60 * 1000);
        //currentDate.setDate(this.sdate.getDate() + this.currentD);

        for (let task of this.taskgroups) {
            task.update(this.currentDate);
        }

        this.currentD++;
        if (this.currentDate > this.edate) {
            // this.play(); // 현재 날짜가 끝나는 날짜를 넘어가면 처음부터 다시 실행
            this.stop();
            this.subSet.visible =true; // 모든게 로드가 되고 아이디가 없는 부분이 보이게
            // 모든게 로드되고 covering과 slab가 로드됨
            //initCovering();
            //initSlab();
        }
        else{
            this.subSet.visible =false;
        }
    }
}