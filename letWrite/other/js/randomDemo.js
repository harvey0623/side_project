const url = 'https://spreadsheets.google.com/feeds/list/11wLZL0bNoD7ZQwfN3Tkx41YB6IgLbv4ftsrxywA0114/1/public/values?alt=json';

const duration = 2000; // 拉霸效果執行多久

fetch(url)
   .then(res => res.json())
   .then(data => {
      let vages = []; // 素
      let meats = []; // 葷

      // 分葷、素，塞入陣列
      const d = data.feed.entry, len = d.length;

      for (let i = 0; i < len; i++) {
         d[i].gsx$vage.$t === '是' ? vages.push(d[i].gsx$shops.$t) : meats.push(d[i].gsx$shops.$t);
      }

      console.log(vages, meats);

      // 點擊按鈕後執行
      let r; // 亂數
      let max, min; // 陣列的最大、小值
      let txt; // 結果


      // 地圖
      const map = document.querySelector('#map iframe');

      // 按鈕
      const btn = document.querySelector('.btn-start');

      btn.addEventListener('click', e => {
         e.preventDefault();

         // 選店家 fn
         const chooseShop = toggle => {

            // 取亂數 fn
            r = () => {
               max = toggle.length - 1;
               min = 0;
               return Math.floor(Math.random() * (max - min + 1)) + min;
            };

            // 清空、插入選項
            let input = document.querySelector('.wrap');
            input.innerHTML = '';
            for (let i = 0; i < toggle.length; i++) {
               input.insertAdjacentHTML('beforeend', '<span>' + toggle[i] + '</span>');
            }

            // 禁止按鈕再被點擊
            e.target.classList.add('not-allow');

            // 加入動畫 class name
            const list = document.querySelectorAll('.wrap > span');
            Array.prototype.forEach.call(list, l => l.classList.add('span-' + (toggle.length - 1)));

            // 亂數決定中選店家
            txt = toggle[r()];
            list[0].innerText = txt;

            // 移除動畫
            setTimeout(() => {
               // 停止拉霸動畫
               Array.prototype.forEach.call(list, l => l.removeAttribute('class'));

               // 改變地圖位置
               map.src = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDtu-vNL3cTLQF_Tongrtckzfs8LS4ClkM&q=' + txt;

            }, duration);

            // 顯示地圖
            map.addEventListener('load', () => {
               map.classList.remove('hidden');
               e.target.classList.remove('not-allow');
            }, false);
         };



         // 地圖先消失
         map.classList.add('hidden');

         // 判斷葷素後，開始執行
         let vage = document.getElementById('vage');
         vage.checked ? chooseShop(vages) : chooseShop(meats);

      }, false);

   })