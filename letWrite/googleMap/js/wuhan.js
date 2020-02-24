const api = 'https://script.google.com/macros/s/AKfycbxC425IS9ntTUJ2k1rLzyDhKmj4R5wnyTS4JFaUnysctbQ1mXAO/exec'

new Vue({
   el: '#app',
   data: () => ({
      map: null,
      wuhanData: null,
      currentId: '',
      infoWindowArr: [],
   }),
   computed: {
      medicalRecord() {
         if (this.wuhanData === null) return [];
         let { confirmed, recovered, death } = this.wuhanData;
         return confirmed.reduce((prev, current, index) => {
            prev.push({
               id: this.createId(index),
               'Province/State': current['Province/State'],
               'Country/Region': current['Country/Region'],
               lat: parseFloat(current.Lat),
               Long: parseFloat(current.Long),
               confirmed: this.getLastKeyValue(current),
               recovered: this.getLastKeyValue(recovered[index]),
               death: this.getLastKeyValue(death[index])
            });
            return prev;
         }, []);
      }
   },
   methods: {
      createId(index) { //建立id
         return 'A' + new Date().getTime() + (index * 2);
      },
      getData() {
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
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            styles: wuhanMapStyle
         });
      },
      setMarker() {  //建立圖標
         this.medicalRecord.forEach(medical => {
            let marker = new google.maps.Marker({
               position: this.getLatLngInstance(medical.lat, medical.Long),
               map: this.map
            });
            let infowInstance = this.setInfowWindow(medical);
            this.infoWindowArr.push({ id: medical.id, infowInstance });
            marker.addListener('click', () => {
               this.currentId = medical.id;
               infowInstance.open(this.map, marker);
            });
         });
      },
      setInfowWindow(medical) {  //建立視窗
         let infowindow = new google.maps.InfoWindow({
            content: `
               <h6>${medical['Province/State']}</h6>
               <p>確診：${medical.confirmed}</p>
               <p>康復：${medical.recovered}</p>
               <p>死亡：${medical.death}</p>
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
      showChart() {
         console.log('hello')
      }
   },
   async mounted() {
      this.wuhanData = await this.getData().then(res => res.data);
      this.initMap();
      this.setMarker();
   }
});