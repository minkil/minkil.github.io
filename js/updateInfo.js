        
      // 누적 금액 관련
      AFRAME.registerComponent('update-cost', {
        init: function () { 
        },
        tick: function (time, timeDelta) {
          // text 부분
          var curCt = taskScheduler.current_cost().toLocaleString('en-US');
          var allCt = taskScheduler.all_cost().toLocaleString('en-US');
          var percentage = taskScheduler.current_cost() / taskScheduler.all_cost() * 100;
          percentage = Math.round(percentage);
          var e_cost = document.querySelector('#id_cost');
          var e_allCost = document.querySelector('#allCost'); 
          e_cost.setAttribute("value", curCt);
          e_allCost.setAttribute("value", allCt);
          // progress point 부분
          var e_pt = document.querySelector('#cost_progress_point');
          var e_pt_txt = document.querySelector('#cost_percentage_txt');
          var e_width = document.querySelector('#cost_percentage_bar');
          var curLoc = taskScheduler.current_cost() / taskScheduler.all_cost();
          let min_x = 0;
          let max_x = 8.3;
          // max - min 값이 progress bar에서 width 길이와 비슷해야 함. 
          let cur_x = (max_x - min_x) * curLoc + min_x;
          e_pt.setAttribute("position", `${cur_x} ${0} ${0}`);
          e_pt_txt.setAttribute("text", "value", `${percentage}%`);
          e_width.setAttribute("width",`${cur_x}`);
          // 아래 포지션을 안주면 percentage_bar가 가운데부터 시작함. simple math solved it
          e_width.setAttribute("position", `${cur_x/2 - 4.3} ${0} ${0.01}`);
        }
      }); 

      // 진행 날짜 관련
      AFRAME.registerComponent('update-date', {
        init: function () { 
        },
        tick: function (time, timeDelta) {
          // text 부분
          var curDt = taskScheduler.current_date();
          var lastDt = taskScheduler.last_date();
          var e_date = document.querySelector('#id_date');
          var lastDate = document.querySelector('#lastDate');
          e_date.setAttribute("value", curDt);
          lastDate.setAttribute("value", lastDt);
          // progress point 부분
          var e_pt = document.querySelector('#progress_point');
          var e_width = document.querySelector('#percentage_bar');
          var e_pt_txt = document.querySelector('#date_percentage_txt');
          var curLoc = taskScheduler.current_loc();
          let min_x = 0;
          let max_x = 8.3;
          // max - min 값이 progress bar에서 width + 0.3ish 길이와 맞아야 함. 
          let cur_x = (max_x - min_x) * curLoc + min_x;        
          e_pt.setAttribute("position", `${cur_x} ${0} ${0}`);

          let percentage = Math.round((cur_x / (max_x - min_x)) * 100);
          e_pt_txt.setAttribute("text", "value", `${percentage}%`);
          e_width.setAttribute("width",`${cur_x}`);
          e_width.setAttribute("position",`${cur_x/2 -4.3} ${0} ${0.01}`);
        }
      });    
