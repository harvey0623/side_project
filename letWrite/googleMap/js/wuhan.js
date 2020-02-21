const api = 'https://script.google.com/macros/s/AKfycbxC425IS9ntTUJ2k1rLzyDhKmj4R5wnyTS4JFaUnysctbQ1mXAO/exec'

new Vue({
   el: '#app',
   data: () => ({
      map: null,
      wuhanData: null
   }),
   computed: {
      medicalRecord() {
         if (this.wuhanData === null) return [];
         let { confirmed, recovered, death } = this.wuhanData;
         let result = confirmed.reduce((prev, current, index) => {
            prev.push({
               id: index,
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
         return result;
      }
   },
   methods: {
      getData() {
         return axios.get(api);
      },
      getLastKeyValue(obj) {
         let keyArr = Object.keys(obj);
         let keyLength = keyArr.length;
         let lastKey = keyArr[keyLength - 1];
         return parseInt(obj[lastKey]);
      },
      initMap() {
         let center = { lat: 30.97564, lng: 112.2707 };
         this.map = new google.maps.Map(this.$refs.map, {
            center: center,
            zoom: 5,
            mapTypeId: 'roadmap',
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            styles: wuhanMapStyle
         });
      }
   },
   async mounted() {
      this.wuhanData = await this.getData().then(res => res.data);
      this.initMap();
   }
});