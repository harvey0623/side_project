const api = 'https://script.google.com/macros/s/AKfycbxC425IS9ntTUJ2k1rLzyDhKmj4R5wnyTS4JFaUnysctbQ1mXAO/exec';

new Vue({
   el: '#app',
   data: () => ({
      map: null,
      wuhanData: null,
      currentId: '',
      currentType: '',
      infoWindowArr: [],
      typeList: [
         { id: 'confirmed', title: '確診' },
         { id: 'recovered', title: '康復' },
         { id: 'death', title: '死亡' }
      ]
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
               confirmed: this.getLastKeyValue(current),
               recovered: this.getLastKeyValue(recovered[index]),
               death: this.getLastKeyValue(death[index])
            });
            return prev;
         }, []);
      },
      heatMapData() {  //地圖熱點資料
         if (this.medicalRecord.length === 0) return [];
         return this.medicalRecord.reduce((prev, current) => {
            let { lat, Long, confirmed, province } = current;
            if (province === 'Hubei') confirmed *= 0.15;
            prev.push({
               location: this.getLatLngInstance(lat, Long),
               weight: confirmed
            });
            return prev;
         }, []);
      },
      targetTypeList() {  //目前總類列表
         if (this.medicalRecord.length == 0) return [];
         return this.medicalRecord.map(item => ({
            id: item.id,
            title: item.province || item.country,
            count: item[this.currentType]
         })).sort((a, b) => b.count - a.count);
      }
   },
   methods: {
      createId(index) { //建立id
         return 'A' + new Date().getTime() + (index * 2);
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
               <p>確診: ${medical.confirmed}</p>
               <p>康復: ${medical.recovered}</p>
               <p>死亡: ${medical.death}</p>
               <button class="btn btn-secondary" id="${medical.id}">
                  開啟圖表
               </button>`
         });
         infowindow.addListener('domready', this.infoWindowReady);
         return infowindow;
      },
      infoWindowReady() {  //視窗ready事件
         let button = document.querySelector(`#${this.currentId}`);
         button.addEventListener('click', this.showChart);
      },
      showChart() {  //顯示圖表
         console.log('hello')
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
      }
   },
   async mounted() {
      this.wuhanData = await this.getData().then(res => res.data);
      this.initMap();
      this.setMarker();
      this.setHeatMap();
   }
});