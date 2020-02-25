const api = 'https://script.google.com/macros/s/AKfycbxC425IS9ntTUJ2k1rLzyDhKmj4R5wnyTS4JFaUnysctbQ1mXAO/exec';
const excludeKey = ['Province/State', 'Country/Region', 'Lat', 'Long'];

new Vue({
   el: '#app',
   data: () => ({
      map: null,
      wuhanData: null,
      currentId: '',
      currentType: '',
      infoWindowArr: [],
      typeList: [
         { id: 'confirmedNumber', title: '確診' },
         { id: 'recoveredNumber', title: '康復' },
         { id: 'deathNumber', title: '死亡' }
      ],
      chartInstance: null,
      showChart: false,
      isLoading: false
   }),
   created() {
      this.currentType = this.typeList[0].id;
   },
   computed: {
      medicalRecord() {  //全部資料整理
         if (this.wuhanData === null) return [];
         let { confirmed, recovered, death } = this.wuhanData;
         return confirmed.reduce((prev, current, index) => {
            prev.push({
               id: this.createId(index),
               province: current['Province/State'],
               country: current['Country/Region'],
               lat: parseFloat(current.Lat),
               Long: parseFloat(current.Long),
               confirmedNumber: this.getLastKeyValue(current),
               recoveredNumber: this.getLastKeyValue(recovered[index]),
               deathNumber: this.getLastKeyValue(death[index]),
               confirmedValue: this.getTypeValue(confirmed[index]),
               recoveredValue: this.getTypeValue(recovered[index]),
               deathVlaue: this.getTypeValue(death[index])
            });
            return prev;
         }, []);
      },
      heatMapData() {  //地圖熱點資料
         if (this.medicalRecord.length === 0) return [];
         return this.medicalRecord.reduce((prev, current) => {
            let { lat, Long, confirmedNumber, province } = current;
            if (province === 'Hubei') confirmedNumber *= 0.15;
            prev.push({
               location: this.getLatLngInstance(lat, Long),
               weight: confirmedNumber
            });
            return prev;
         }, []);
      },
      targetTypeList() {  //目前總類列表
         if (this.medicalRecord.length === 0) return [];
         return this.medicalRecord.map(item => ({
            id: item.id,
            title: item.province || item.country,
            count: item[this.currentType]
         })).sort((a, b) => b.count - a.count);
      },
      targetRecord() {  //特定地點記錄
         if (this.medicalRecord.length === 0) return {};
         let targetObj = this.medicalRecord.find(item => item.id === this.currentId);
         if (targetObj !== undefined) return targetObj;
         else return {};
      },
      chartLabelX() {  //取得圖表的label
         if (this.wuhanData === null) return [];
         let data = this.wuhanData.confirmed[0];
         let keyArr = [];
         for (let key in data) {
            if (data.hasOwnProperty(key)) {
               if (excludeKey.indexOf(key) === -1) {
                  keyArr.push(key.replace(/\r/g, ''));
               }
            }
         }
         return keyArr;
      }
   },
   methods: {
      createId(index) { //建立id
         return 'A' + new Date().getTime() + (index * 2);
      },
      getTypeValue(obj) {  //取得圖表需要的欄位值
         let tempArr = [];
         for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
               if (excludeKey.indexOf(key) === -1) {
                  tempArr.push(parseInt(obj[key]));
               } 
            }
         }
         return tempArr;
      },
      getData() { //取得資料
         return axios.get(api);
      },
      getLastKeyValue(obj) {  //取得最後一個key值
         let keyArr = Object.keys(obj);
         let keyLength = keyArr.length;
         let lastKey = keyArr[keyLength - 1];
         return parseInt(obj[lastKey]);
      },
      getLatLngInstance(lat, lng) {  //取得經緯度實體
         return new google.maps.LatLng(lat, lng);
      },
      initMap() {  //初始化地圖
         this.map = new google.maps.Map(this.$refs.map, {
            center: this.getLatLngInstance(30.97564, 112.2707),
            zoom: 5,
            mapTypeId: 'roadmap',
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            styles: wuhanMapStyle
         });
      },
      setMarker() {  //建立圖標
         this.medicalRecord.forEach(medical => {
            let markerInstance = new google.maps.Marker({
               position: this.getLatLngInstance(medical.lat, medical.Long),
               map: this.map
            });
            let infowInstance = this.setInfowWindow(medical);
            this.infoWindowArr.push({ id: medical.id, infowInstance, markerInstance });
            markerInstance.addListener('click', () => {
               this.currentId = medical.id;
               infowInstance.open(this.map, markerInstance);
            });
         });
      },
      setInfowWindow(medical) {  //建立視窗
         let infowindow = new google.maps.InfoWindow({
            content: `
               <h6>Country: ${medical.country}</h6>
               <h6>Province: ${medical.province}</h6>
               <p class="typeP">確診: ${medical.confirmedNumber}人</p>
               <p class="typeP">康復: ${medical.recoveredNumber}人</p>
               <p class="typeP">死亡: ${medical.deathNumber}人</p>
               <button class="btn btn-secondary" id="${medical.id}">
                  開啟圖表
               </button>`
         });
         infowindow.addListener('domready', this.infoWindowReady);
         return infowindow;
      },
      infoWindowReady() {  //視窗ready事件
         let button = document.querySelector(`#${this.currentId}`);
         button.addEventListener('click', this.clickHandler);
      },
      setHeatMap() {  //設置地圖熱點
         new google.maps.visualization.HeatmapLayer({
            data: this.heatMapData,
            map: this.map,
            dissipating: true,
            radius: 40,
         });
      },
      triggerInfoWindow(id) {  //開啟infowindow視窗
         this.currentId = id;
         let { infowInstance, markerInstance } = this.infoWindowArr.find(info => info.id === id);
         infowInstance.open(this.map, markerInstance);
      },
      moveMap() {  //移動地圖位置
         let { id, lat, Long } = this.targetRecord;
         if (id === undefined) return;
         this.map.panTo(this.getLatLngInstance(lat, Long));
      },
      clickHandler(evt) {
         this.currentId = evt.target.id;
         this.createChart();
         this.showChart = true;
      },
      createChart() {  //繪製圖表
         let { confirmedValue, recoveredValue, deathVlaue } = this.targetRecord;
         let confirmedItem  = {
            label: '確診',
            backgroundColor: '#2196F3',
            borderColor: '#2196F3',
            data: confirmedValue,
            fill: false
         };
         let recoveredItem = {
            label: '康復',
            backgroundColor: '#4CAF50',
            borderColor: '#4CAF50',
            data: recoveredValue,
            fill: false
         };
         let deathItem = {
            label: '死亡',
            backgroundColor: '#f44336',
            borderColor: '#f44336',
            data: deathVlaue,
            fill: false
         };
         var config = {
            type: 'line',
            data: {
               labels: this.chartLabelX,
               datasets: [confirmedItem, recoveredItem, deathItem]
            },
            options: {
               responsive: true,
               tooltips: {
                  mode: 'index',
                  intersect: false,
               },
               hover: {
                  mode: 'nearest',
                  intersect: true
               },
               scales: {
                  xAxes: [{
                     display: true,
                     scaleLabel: {
                        display: true,
                        labelString: '日期'
                     }
                  }],
                  yAxes: [{
                     display: true,
                     scaleLabel: {
                        display: true,
                        labelString: '人數'
                     }
                  }]
               }
            }
         };
         this.destroChart();
         let ctx = this.$refs.chart.getContext('2d');
         this.chartInstance = new Chart(ctx, config);
      },
      destroChart() {
         if (this.chartInstance !== null) this.chartInstance.destroy();
      }
   },
   watch: {
      targetRecord() {
         this.moveMap();
      }
   },
   async mounted() {
      this.isLoading = true;
      this.wuhanData = await this.getData().then(res => res.data);
      this.initMap();
      this.setMarker();
      this.setHeatMap();
      this.isLoading = false;
   }
});